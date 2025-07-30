/* eslint playwright/no-skipped-test:0 */
import { Route } from 'next';

import { createTestUser, deleteTestUser } from '@/utils/supabase/general';
import { wrongEmails } from '@/utils/validation';

import { expect, test } from './fixtures';

test.describe('password_reset_flow - @unauthenticated', () => {
  test('password reset form should be disabled if wrong format email provided - @desktop @tablet @mobile', async ({
    page,
  }) => {
    const passwordResetPath: Route = '/dashboard/forgot-password';
    const wrongEmail = wrongEmails[0];

    await page.goto(passwordResetPath);
    const emailInput = page.getByPlaceholder(/enter your email/i);
    await emailInput.pressSequentially(wrongEmail);
    const submitButton = page.getByRole('button', {
      name: 'Send password reset email',
    });

    await expect(submitButton).toBeDisabled();
  });

  test('password reset page should display success info for non existing email - @desktop @tablet @mobile', async ({
    page,
  }) => {
    const passwordResetPath: Route = '/dashboard/forgot-password';
    const nonExistingEmail = `${crypto.randomUUID()}@${crypto.randomUUID()}.com`;

    await page.goto(passwordResetPath);
    const emailInput = page.getByPlaceholder(/enter your email/i);
    await emailInput.pressSequentially(nonExistingEmail);
    const submitButton = page.getByRole('button', {
      name: 'Send password reset email',
    });
    await submitButton.click();
    const successToast = page.getByLabel(/success notification/i);

    await expect(successToast).toBeInViewport();
  });

  test('password reset page should display success info for existing email - @desktop @tablet @mobile', async ({
    page,
  }) => {
    const testUserIndex = test.info().workerIndex;
    const { email } = await createTestUser(testUserIndex);
    const passwordResetPath: Route = '/dashboard/forgot-password';

    await page.goto(passwordResetPath);
    const emailInput = page.getByPlaceholder(/enter your email/i);
    await emailInput.pressSequentially(email);
    const submitButton = page.getByRole('button', {
      name: 'Send password reset email',
    });
    await submitButton.click();
    const successToast = page.getByLabel(/success notification/i);

    await expect(successToast).toBeInViewport();

    await deleteTestUser(testUserIndex);
  });
});

test.describe('password_reset_flow - @authenticated', () => {
  test('password change form should be disabled if wrong format password provided - @desktop @tablet @mobile', async ({
    authenticatedPage,
  }) => {
    const accountSettingsPath: Route = '/dashboard/account';
    const tooShortPassword = 'short';
    const page = authenticatedPage.page;

    await page.goto(accountSettingsPath);
    const newPasswordInput = page.getByPlaceholder(/enter new password/i);
    const confirmPasswordInput = page.getByPlaceholder(/confirm password/i);
    const submitButton = page
      .getByLabel('password change')
      .getByRole('button', { name: 'Save' });
    const newPasswordVisibilityButton = page
      .locator('label')
      .filter({ hasText: /new password/i })
      .getByLabel('toggle visibility')
      .first();
    const confirmPasswordVisibilityButton = page
      .locator('label')
      .filter({ hasText: /confirm password/i })
      .getByLabel('toggle visibility')
      .last();
    await newPasswordVisibilityButton.click();
    await confirmPasswordVisibilityButton.click();
    await newPasswordInput.fill(tooShortPassword);
    await confirmPasswordInput.fill(tooShortPassword);

    await expect(submitButton).toBeDisabled();
  });

  test('password change form should be disabled if passwords differ - @desktop @tablet @mobile', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage.page;
    const accountSettingsPath: Route = '/dashboard/account';
    const correctPassword = 'correct';
    const anotherCorrectPassword = 'anotherCorrect';

    await page.goto(accountSettingsPath);
    const newPasswordInput = page.getByPlaceholder(/enter new password/i);
    const confirmPasswordInput = page.getByPlaceholder(/confirm password/i);
    const submitButton = page
      .getByLabel('password change')
      .getByRole('button', { name: 'Save' });
    const newPasswordVisibilityButton = page
      .locator('label')
      .filter({ hasText: /new password/i })
      .getByLabel('toggle visibility')
      .first();
    const confirmPasswordVisibilityButton = page
      .locator('label')
      .filter({ hasText: /confirm password/i })
      .getByLabel('toggle visibility')
      .last();
    await newPasswordVisibilityButton.click();
    await confirmPasswordVisibilityButton.click();
    await newPasswordInput.fill(correctPassword);
    await confirmPasswordInput.fill(anotherCorrectPassword);

    await expect(submitButton).toBeDisabled();
  });

  test('error info should be displayed if new password are same as current password - @desktop @tablet @mobile', async ({
    authenticatedPage,
    testUserAccountCredentials,
  }) => {
    const page = authenticatedPage.page;
    const accountSettingsPath: Route = '/dashboard/account';
    const { password } = testUserAccountCredentials;

    await page.goto(accountSettingsPath);
    const newPasswordInput = page.getByPlaceholder(/enter new password/i);
    const confirmPasswordInput = page.getByPlaceholder(/confirm password/i);
    const submitButton = page
      .getByLabel('password change')
      .getByRole('button', { name: 'Save' });
    const newPasswordVisibilityButton = page
      .locator('label')
      .filter({ hasText: /new password/i })
      .getByLabel('toggle visibility')
      .first();
    const confirmPasswordVisibilityButton = page
      .locator('label')
      .filter({ hasText: /confirm password/i })
      .getByLabel('toggle visibility')
      .last();
    await newPasswordVisibilityButton.click();
    await confirmPasswordVisibilityButton.click();
    await newPasswordInput.fill(password);
    await confirmPasswordInput.fill(password);
    await submitButton.click();
    const errorToast = page.getByLabel(/error notification:/);

    await expect(errorToast).toBeInViewport();
    await expect(errorToast).toHaveText(
      /new password should be different from the old password/i,
    );
  });

  test('success info should be displayed if password successfully changed - @desktop @tablet @mobile', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage.page;
    const accountSettingsPath: Route = '/dashboard/account';
    const newPassword = 'newPassword';

    await page.goto(accountSettingsPath);
    const newPasswordInput = page.getByPlaceholder(/enter new password/i);
    const confirmPasswordInput = page.getByPlaceholder(/confirm password/i);
    const submitButton = page
      .getByLabel('password change')
      .getByRole('button', { name: 'Save' });
    const newPasswordVisibilityButton = page
      .locator('label')
      .filter({ hasText: /new password/i })
      .getByLabel('toggle visibility')
      .first();
    const confirmPasswordVisibilityButton = page
      .locator('label')
      .filter({ hasText: /confirm password/i })
      .getByLabel('toggle visibility')
      .last();
    await newPasswordVisibilityButton.click();
    await confirmPasswordVisibilityButton.click();
    await newPasswordInput.fill(newPassword);
    await confirmPasswordInput.fill(newPassword);
    await submitButton.click();
    const successToast = page.getByLabel(/success notification:/);

    await expect(successToast).toBeInViewport();
    await expect(successToast).toHaveText(/your password has been changed/i);
  });
});
