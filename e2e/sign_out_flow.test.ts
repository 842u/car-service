import test, { expect } from '@playwright/test';
import { Route } from 'next';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

test.describe('sign_out_flow - @authenticated', () => {
  test.afterEach('refresh auth token', async ({ page }) => {
    await page.context().clearCookies();

    const signInPath: Route = '/dashboard/sign-in';
    const testUserEmail = process.env.SUPABASE_TEST_USER_EMAIL!;
    const testUserPassword = process.env.SUPABASE_TEST_USER_PASSWORD!;

    await page.goto(signInPath);
    const emailInput = page.getByPlaceholder(/enter your email/i);
    const passwordInput = page.getByPlaceholder(/enter your password/i);
    // For some reason, the webkit browser requires input to be set to a textbox instead of a password. It may not be able to read the value of the password type.
    const togglePasswordVisibility = page.getByLabel(/toggle visibility/i);
    await togglePasswordVisibility.click();
    await emailInput.fill(testUserEmail);
    await passwordInput.fill(testUserPassword);
    const submitButton = page.getByRole('button', { name: /sign in/i });
    await submitButton.click();
    const successToast = page.getByLabel(/success notification/i);

    // Due to inconsistencies between how webkit and other browsers handle cookie attributes, those attributes must be set manually to prevent errors in tests.
    await expect(page).toHaveURL('/dashboard');
    const cookieBuffer = await page.context().cookies();
    if (cookieBuffer[0]) {
      cookieBuffer[0].sameSite === 'None'
        ? (cookieBuffer[0].secure = true)
        : (cookieBuffer[0].secure = false);
    }

    await page.context().clearCookies();
    await page.context().addCookies(cookieBuffer);
    await expect(page).toHaveURL('/dashboard');
    await expect(successToast).toBeInViewport();

    await page.context().storageState({ path: authFile });
  });

  test('should sign out user on sign out click - @mobile', async ({ page }) => {
    const dashboardPath: Route = '/dashboard';

    await page.goto(dashboardPath);
    const hamburgerButton = page.getByLabel(/toggle navigation menu/i);
    await hamburgerButton.click();
    const signOutLink = page.getByRole('link', { name: /Sign Out/i });
    await signOutLink.click();

    await expect(page).toHaveURL('/' as Route);
    expect((await page.context().cookies()).length).toBe(0);
  });

  test('should sign out user on sign out click - @desktop @tablet', async ({
    page,
  }) => {
    const dashboardPath: Route = '/dashboard';

    await page.goto(dashboardPath);
    const signOutLink = page.getByRole('link', { name: /Sign Out/i });
    await signOutLink.click();

    await expect(page).toHaveURL('/' as Route);
    expect((await page.context().cookies()).length).toBe(0);
  });
});
