import test, { expect } from '@playwright/test';
import { Route } from 'next';

import { createTestUser, deleteTestUser } from '@/utils/supabase/general';
import { wrongEmails } from '@/utils/validation';

test.describe('password_reset_flow - @unauthenticated', () => {
  test('go to password reset page - @desktop @tablet @mobile', async ({
    page,
  }) => {
    const signInPath: Route = '/dashboard/sign-in';
    const passwordResetPath: Route = '/dashboard/forgot-password';

    await page.goto(signInPath);
    const forgotPasswordLink = page.getByRole('link', {
      name: /forgot password/i,
    });
    await forgotPasswordLink.click();

    await expect(page).toHaveURL(passwordResetPath);
  });

  test('password reset form should be disabled if wrong format email provided - @desktop @tablet @mobile', async ({
    page,
  }) => {
    const passwordResetPath: Route = '/dashboard/forgot-password';
    const wrongEmail = wrongEmails[0];

    await page.goto(passwordResetPath);
    const emailInput = page.getByPlaceholder(/enter your email/i);
    await emailInput.fill(wrongEmail);
    const submitButton = page.getByLabel(/send password reset email/i);

    await expect(submitButton).toBeDisabled();
  });

  test('password reset page should display success info for non existing email - @desktop @tablet @mobile', async ({
    page,
  }) => {
    await deleteTestUser();
    const passwordResetPath: Route = '/dashboard/forgot-password';
    const nonExistingEmail = process.env.SUPABASE_TEST_USER_EMAIL!;

    await page.goto(passwordResetPath);
    const emailInput = page.getByPlaceholder(/enter your email/i);
    await emailInput.pressSequentially(nonExistingEmail);
    const submitButton = page.getByLabel(/send password reset email/i);
    await submitButton.click();
    const successToast = page.getByLabel(/success notification/i);

    await expect(successToast).toBeInViewport();
  });

  test('password reset page should display success info for existing email - @desktop @tablet @mobile', async ({
    page,
  }) => {
    await deleteTestUser();
    await createTestUser();
    const passwordResetPath: Route = '/dashboard/forgot-password';
    const nonExistingEmail = process.env.SUPABASE_TEST_USER_EMAIL!;

    await page.goto(passwordResetPath);
    const emailInput = page.getByPlaceholder(/enter your email/i);
    await emailInput.pressSequentially(nonExistingEmail);
    const submitButton = page.getByLabel(/send password reset email/i);
    await submitButton.click();
    const successToast = page.getByLabel(/success notification/i);

    await expect(successToast).toBeInViewport();
  });
});

test.describe('password_reset_flow - @authenticated', () => {
  test('go to account settings from dashboard - @desktop @tablet', async ({
    page,
  }) => {
    const dashboardPath: Route = '/dashboard';
    const accountSettingsPath: Route = '/dashboard/account';

    await page.goto(dashboardPath);
    const accountSettingsLink = page.getByRole('link', { name: /account/i });
    await accountSettingsLink.click();

    await expect(page).toHaveURL(accountSettingsPath);
  });

  test('go to account settings from dashboard - @mobile', async ({ page }) => {
    const dashboardPath: Route = '/dashboard';
    const accountSettingsPath: Route = '/dashboard/account';

    await page.goto(dashboardPath);
    const hamburgerButton = page.getByLabel(/toggle navigation menu/i);
    await hamburgerButton.click();
    const accountSettingsLink = page.getByRole('link', { name: /account/i });
    await accountSettingsLink.click();

    await expect(page).toHaveURL(accountSettingsPath);
  });

  test('password change form should be disabled if wrong password provided -  @desktop @tablet @mobile', async ({
    page,
  }) => {
    const accountSettingsPath: Route = '/dashboard/account';
    const wrongPassword = 'wrong';

    await page.goto(accountSettingsPath);
    const newPasswordInput = page.getByPlaceholder(/enter new password/i);
    const confirmPasswordInput = page.getByPlaceholder(/confirm password/i);
    const submitButton = page.getByLabel('Reset', { exact: true });
    const newPasswordVisibilityButton = page
      .locator('label')
      .filter({ hasText: /new password/i })
      .getByLabel('toggle visibility');
    const confirmPasswordVisibilityButton = page
      .locator('label')
      .filter({ hasText: /confirm password/i })
      .getByLabel('toggle visibility');
    await newPasswordVisibilityButton.click();
    await confirmPasswordVisibilityButton.click();
    await newPasswordInput.pressSequentially(wrongPassword);
    await confirmPasswordInput.pressSequentially(wrongPassword);

    await expect(submitButton).toBeDisabled();
  });

  test('password change form should be disabled if passwords differ -  @desktop @tablet @mobile', async ({
    page,
  }) => {
    const accountSettingsPath: Route = '/dashboard/account';
    const correctPassword = 'correct';
    const anotherCorrectPassword = 'anotherCorrect';

    await page.goto(accountSettingsPath);
    const newPasswordInput = page.getByPlaceholder(/enter new password/i);
    const confirmPasswordInput = page.getByPlaceholder(/confirm password/i);
    const submitButton = page.getByLabel('Reset', { exact: true });
    const newPasswordVisibilityButton = page
      .locator('label')
      .filter({ hasText: /new password/i })
      .getByLabel('toggle visibility');
    const confirmPasswordVisibilityButton = page
      .locator('label')
      .filter({ hasText: /confirm password/i })
      .getByLabel('toggle visibility');
    await newPasswordVisibilityButton.click();
    await confirmPasswordVisibilityButton.click();
    await newPasswordInput.pressSequentially(correctPassword);
    await confirmPasswordInput.pressSequentially(anotherCorrectPassword);

    await expect(submitButton).toBeDisabled();
  });

  test('error info should be displayed if new password are same as current password -  @desktop @tablet @mobile', async ({
    page,
  }) => {
    const accountSettingsPath: Route = '/dashboard/account';
    const oldPassword = process.env.SUPABASE_TEST_USER_PASSWORD!;

    await page.goto(accountSettingsPath);
    const newPasswordInput = page.getByPlaceholder(/enter new password/i);
    const confirmPasswordInput = page.getByPlaceholder(/confirm password/i);
    const submitButton = page.getByLabel('Reset', { exact: true });
    const newPasswordVisibilityButton = page
      .locator('label')
      .filter({ hasText: /new password/i })
      .getByLabel('toggle visibility');
    const confirmPasswordVisibilityButton = page
      .locator('label')
      .filter({ hasText: /confirm password/i })
      .getByLabel('toggle visibility');
    await newPasswordVisibilityButton.click();
    await confirmPasswordVisibilityButton.click();
    await newPasswordInput.pressSequentially(oldPassword);
    await confirmPasswordInput.pressSequentially(oldPassword);
    await submitButton.click();
    const errorToast = page.getByLabel(/error notification:/);

    await expect(errorToast).toBeInViewport();
    await expect(errorToast).toHaveText(
      /new password should be different from the old password/i,
    );
  });

  test('success info should be displayed password successfully changed -  @desktop @tablet @mobile', async ({
    page,
  }) => {
    const accountSettingsPath: Route = '/dashboard/account';
    const newPassword = 'newPassword';

    await page.goto(accountSettingsPath);
    const newPasswordInput = page.getByPlaceholder(/enter new password/i);
    const confirmPasswordInput = page.getByPlaceholder(/confirm password/i);
    const submitButton = page.getByLabel('Reset', { exact: true });
    const newPasswordVisibilityButton = page
      .locator('label')
      .filter({ hasText: /new password/i })
      .getByLabel('toggle visibility');
    const confirmPasswordVisibilityButton = page
      .locator('label')
      .filter({ hasText: /confirm password/i })
      .getByLabel('toggle visibility');
    await newPasswordVisibilityButton.click();
    await confirmPasswordVisibilityButton.click();
    await newPasswordInput.pressSequentially(newPassword);
    await confirmPasswordInput.pressSequentially(newPassword);
    await submitButton.click();
    const successToast = page.getByLabel(/success notification:/);
    const closeToastButton = page.getByLabel(/close notification/i);

    await expect(successToast).toBeInViewport();
    await expect(successToast).toHaveText(/your password has been changed/i);

    await closeToastButton.click();
    await newPasswordInput.pressSequentially(
      process.env.SUPABASE_TEST_USER_PASSWORD!,
    );
    await confirmPasswordInput.pressSequentially(
      process.env.SUPABASE_TEST_USER_PASSWORD!,
    );
    await submitButton.click();

    const successToastSecond = page.getByLabel(/success notification:/);

    await expect(successToastSecond).toBeInViewport();
    await expect(successToastSecond).toHaveText(
      /your password has been changed/i,
    );
  });
});
