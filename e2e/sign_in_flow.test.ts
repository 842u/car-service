import type { Route } from 'next';

import { createTestUser, deleteTestUser } from '@/utils/supabase/general';
import { wrongEmails } from '@/utils/validation';

import { expect, test } from './fixtures';

test.describe('sign_in_flow - @unauthenticated', () => {
  test('submit button should be disabled if auth form is filled incorrectly - @desktop @tablet @mobile', async ({
    page,
  }) => {
    const signInPath: Route = '/dashboard/sign-in';
    const wrongEmail = wrongEmails[0];
    const wrongPassword = 'wrong';

    await page.goto(signInPath);
    const emailInput = page.getByRole('textbox', { name: /email/i });
    const passwordInput = page.getByRole('textbox', { name: /password/i });
    await emailInput.fill(wrongEmail);
    await passwordInput.fill(wrongPassword);
    const submitButton = page.getByRole('button', { name: /sign in/i });

    await expect(submitButton).toBeDisabled();
  });

  test('error info should be displayed if wrong credentials provided - @desktop @tablet @mobile', async ({
    page,
  }) => {
    const nonExistingEmail = `${crypto.randomUUID()}@${crypto.randomUUID()}.com`;
    const password = 'someCorrectPassword';
    const signInPath: Route = '/dashboard/sign-in';

    await page.goto(signInPath);
    const emailInput = page.getByPlaceholder(/enter your email/i);
    const passwordInput = page.getByPlaceholder(/enter your password/i);

    const togglePasswordVisibility = page.getByRole('button', {
      name: 'toggle visibility',
    });
    await togglePasswordVisibility.click();
    await emailInput.fill(nonExistingEmail);
    await passwordInput.fill(password);
    const submitButton = page.getByRole('button', { name: /sign in/i });
    await submitButton.click();
    const errorToast = page.getByLabel(/error notification/i);

    await expect(errorToast).toBeInViewport();
    await expect(submitButton).toBeDisabled();
    await expect(page).toHaveURL(signInPath);
  });

  test('success info should be displayed on successful auth form sign in - @desktop @tablet @mobile', async ({
    page,
  }) => {
    const workerIndex = test.info().workerIndex;
    const { email, password } = await createTestUser(workerIndex);
    const signInPath: Route = '/dashboard/sign-in';
    const dashboardPath: Route = '/dashboard';

    await page.goto(signInPath);
    const emailInput = page.getByPlaceholder(/enter your email/i);
    const passwordInput = page.getByPlaceholder(/enter your password/i);
    const togglePasswordVisibility = page.getByRole('button', {
      name: 'toggle visibility',
    });
    await togglePasswordVisibility.click();
    await emailInput.fill(email);
    await passwordInput.fill(password);
    const submitButton = page.getByRole('button', { name: /sign in/i });
    await submitButton.click();
    const successToast = page.getByLabel(/success notification/i);

    await expect(page).toHaveURL(dashboardPath);
    await expect(successToast).toBeInViewport();

    await deleteTestUser(workerIndex);
  });
});
