import { expect, test } from '@playwright/test';
import { Route } from 'next';

import { createTestUser, deleteTestUser } from '@/utils/supabase/general';

test.describe('sign_in_flow', () => {
  test('go to sign in page from landing page', async ({ page }) => {
    const homePagePath: Route = '/';
    const signInPath: Route = '/dashboard/sign-in';

    await page.goto(homePagePath);
    const signInLink = page.getByRole('link', { name: /sign in/i });
    await signInLink.click();

    await expect(page).toHaveURL(signInPath);
  });

  test('go to sign in page from clicking navigation dashboard', async ({
    page,
  }) => {
    const homePagePath: Route = '/';
    const signInPath: Route = '/dashboard/sign-in';

    await page.goto(homePagePath);
    const dashboardLink = page.getByRole('link', { name: /dashboard/i });
    await dashboardLink.click();

    await expect(page).toHaveURL(signInPath);
  });

  test('go to sign in page from sign up page', async ({ page }) => {
    const signUpPath: Route = '/dashboard/sign-up';
    const signInPath: Route = '/dashboard/sign-in';

    await page.goto(signUpPath);
    const dashboardLink = page.getByRole('link', { name: /dashboard/i });
    await dashboardLink.click();

    await expect(page).toHaveURL(signInPath);

    await page.goto(signUpPath);
    const signInLink = page.getByRole('link', { name: /sign in/i });
    await signInLink.click();

    await expect(page).toHaveURL(signInPath);
  });

  test('submit button should be disabled if sign in email auth form is filled incorrectly', async ({
    page,
  }) => {
    const signInPath: Route = '/dashboard/sign-in';
    const wrongEmail = 'wrong@email';
    const wrongPassword = 'wrong';

    await page.goto(signInPath);
    const emailInput = page.getByRole('textbox', { name: /email/i });
    const passwordInput = page.getByRole('textbox', { name: /password/i });
    await emailInput.fill(wrongEmail);
    await passwordInput.fill(wrongPassword);
    const submitButton = page.getByRole('button', { name: /sign in/i });

    await expect(submitButton).toBeDisabled();
    await expect(page).toHaveURL(signInPath);
  });

  test('should stay on sign in page if wrong credentials provided and error info should be displayed', async ({
    page,
  }) => {
    await deleteTestUser();
    const testUserEmail = process.env.SUPABASE_TEST_USER_EMAIL!;
    const testUserPassword = process.env.SUPABASE_TEST_USER_PASSWORD!;
    const signInPath: Route = '/dashboard/sign-in';

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
    const errorToast = page.getByLabel(/error notification/i);

    await expect(errorToast).toBeInViewport();
    await expect(submitButton).toBeDisabled();
    await expect(page).toHaveURL(signInPath);
  });

  test('should go to dashboard page on successful email auth sign in and success info should be displayed', async ({
    page,
  }) => {
    await deleteTestUser();
    await createTestUser();
    const testUserEmail = process.env.SUPABASE_TEST_USER_EMAIL!;
    const testUserPassword = process.env.SUPABASE_TEST_USER_PASSWORD!;
    const signInPath: Route = '/dashboard/sign-in';
    const dashboardPath: Route = '/dashboard';

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

    await expect(page).toHaveURL(dashboardPath);
    await expect(successToast).toBeInViewport();
    await deleteTestUser();
  });
});
