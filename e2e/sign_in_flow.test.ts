import { expect, test } from '@playwright/test';
import { Route } from 'next';

test.describe('sign_in_flow', () => {
  test('go to sign in page from navigation', async ({ page }) => {
    const homePagePath: Route = '/';
    const signInPath: Route = '/dashboard/sign-in';

    await page.goto(homePagePath);
    const dashboardLink = page.getByRole('link', { name: /dashboard/i });
    await dashboardLink.click();

    await expect(page).toHaveURL(signInPath);
  });

  test('go to sign in page from welcome section', async ({ page }) => {
    const homePagePath: Route = '/';
    const signInPath: Route = '/dashboard/sign-in';

    await page.goto(homePagePath);
    const signInButton = page.getByRole('link', { name: /sign in/i });
    await signInButton.click();

    await expect(page).toHaveURL(signInPath);
  });

  test('stay on sign in page if wrong email auth credentials provided', async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === 'webkit',
      'button keeps beign disabled even after filling form',
    );

    const signInPath: Route = '/dashboard/sign-in';
    const wrongEmail = 'wrong@email.com';
    const wrongPassword = 'wrongpassword';

    await page.goto(signInPath);
    const emailInput = page.getByRole('textbox', { name: /email/i });
    const passwordInput = page.getByRole('textbox', { name: /password/i });
    await emailInput.fill(wrongEmail);
    await passwordInput.fill(wrongPassword);
    const signInButton = page.getByRole('button', { name: /sign in/i });
    await signInButton.click();

    await expect(page).toHaveURL(signInPath);
  });

  test('go to dashboard page on succesfull email auth sign in', async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === 'webkit',
      'button keeps beign disabled even after filling form',
    );
    const signInPath: Route = '/dashboard/sign-in';
    const dashboardPath: Route = '/dashboard';
    const testAccountEmail = process.env.EMAIL_AUTH_TEST_EMAIL!;
    const testAccountPassword = process.env.EMAIL_AUTH_TEST_PASSWORD!;

    await page.goto(signInPath);
    const emailInput = page.getByRole('textbox', { name: /email/i });
    const passwordInput = page.getByRole('textbox', { name: /password/i });
    await emailInput.fill(testAccountEmail);
    await passwordInput.fill(testAccountPassword);
    const signInButton = page.getByRole('button', { name: /sign in/i });
    await signInButton.click();

    await expect(page).toHaveURL(dashboardPath);
  });
});
