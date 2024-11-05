import test, { expect } from '@playwright/test';
import { Route } from 'next';

import { createTestUser, deleteTestUser } from '@/utils/supabase/general';

test.describe('sign_up_flow', () => {
  test('go to sign up page from landing page', async ({ page }) => {
    const homePagePath: Route = '/';
    const signUpPath: Route = '/dashboard/sign-up';

    await page.goto(homePagePath);
    const signUpLink = page
      .getByLabel('welcome motto')
      .getByRole('link', { name: /sign up/i });
    await signUpLink.click();

    await expect(page).toHaveURL(signUpPath);
  });

  test('go to sign up page from clicking navigation dashboard', async ({
    page,
  }) => {
    const homePagePath: Route = '/';
    const signInPath: Route = '/dashboard/sign-in';
    const signUpPath: Route = '/dashboard/sign-up';

    await page.goto(homePagePath);
    const dashboardLink = page.getByRole('link', { name: /dashboard/i });
    await dashboardLink.click();

    await expect(page).toHaveURL(signInPath);

    const signUpLink = page.getByRole('link', { name: /sign up/i });
    await signUpLink.click();

    await expect(page).toHaveURL(signUpPath);
  });

  test('submit button should be disabled if sign up email auth form is filled incorrectly', async ({
    page,
  }) => {
    const signUpPage: Route = '/dashboard/sign-up';
    const wrongFormatEmail = 'wrong@email';
    const wrongFormatPassword = 'wrong';

    await page.goto(signUpPage);
    const emailInput = page.getByPlaceholder(/enter your email/i);
    const passwordInput = page.getByPlaceholder(/enter your password/i);
    const submitButton = page.getByLabel('Sign Up', { exact: true });

    await expect(emailInput).toBeInViewport();
    await expect(passwordInput).toBeInViewport();

    // For some reason, the webkit browser requires input to be set to a textbox instead of a password. It may not be able to read the value of the password type.
    const togglePasswordVisibility = page.getByLabel(/toggle visibility/i);
    await togglePasswordVisibility.click();
    await emailInput.fill(wrongFormatEmail);
    await passwordInput.fill(wrongFormatPassword);

    await expect(submitButton).toBeDisabled();
    await expect(page).toHaveURL(signUpPage);
  });

  test('should stay on sign up page on successful sign up and success info should be displayed', async ({
    page,
  }) => {
    await deleteTestUser();
    const signUpPage: Route = '/dashboard/sign-up';
    const testUserEmail = process.env.SUPABASE_TEST_USER_EMAIL!;
    const testUserPassword = process.env.SUPABASE_TEST_USER_PASSWORD!;

    await page.goto(signUpPage);
    const emailInput = page.getByPlaceholder(/enter your email/i);
    const passwordInput = page.getByPlaceholder(/enter your password/i);
    const submitButton = page.getByLabel('Sign Up', { exact: true });

    await expect(emailInput).toBeInViewport();
    await expect(passwordInput).toBeInViewport();

    // For some reason, the webkit browser requires input to be set to a textbox instead of a password. It may not be able to read the value of the password type.
    const togglePasswordVisibility = page.getByLabel(/toggle visibility/i);
    await togglePasswordVisibility.click();
    await emailInput.fill(testUserEmail);
    await passwordInput.fill(testUserPassword);
    await submitButton.click();
    const successToast = page.getByLabel(/success notification/i);

    await expect(successToast).toBeInViewport();
    await expect(page).toHaveURL(signUpPage);
  });

  test('should stay on sign up page on existing user email sign up and success info should be displayed', async ({
    page,
  }) => {
    await deleteTestUser();
    await createTestUser();
    const signUpPage: Route = '/dashboard/sign-up';
    const testUserEmail = process.env.SUPABASE_TEST_USER_EMAIL!;
    const testUserPassword = process.env.SUPABASE_TEST_USER_PASSWORD!;

    await page.goto(signUpPage);
    const emailInput = page.getByPlaceholder(/enter your email/i);
    const passwordInput = page.getByPlaceholder(/enter your password/i);
    const submitButton = page.getByLabel('Sign Up', { exact: true });

    await expect(emailInput).toBeInViewport();
    await expect(passwordInput).toBeInViewport();

    // For some reason, the webkit browser requires input to be set to a textbox instead of a password. It may not be able to read the value of the password type.
    const togglePasswordVisibility = page.getByLabel(/toggle visibility/i);
    await togglePasswordVisibility.click();
    await emailInput.fill(testUserEmail);
    await passwordInput.fill(testUserPassword);
    await submitButton.click();
    const successToast = page.getByLabel(/success notification/i);

    await expect(successToast).toBeInViewport();
    await expect(page).toHaveURL(signUpPage);
  });
});
