import { Route } from 'next';

import { createTestUser, deleteTestUser } from '@/utils/supabase/general';
import { wrongEmails } from '@/utils/validation';

import { expect, test } from './fixtures';

test.describe('sign_up_flow - @unauthenticated', () => {
  test('submit button should be disabled if sign up email auth form is filled incorrectly - @desktop @tablet @mobile', async ({
    page,
  }) => {
    const signUpPage: Route = '/dashboard/sign-up';
    const wrongFormatEmail = wrongEmails[0];
    const wrongFormatPassword = 'wrong';

    await page.goto(signUpPage);
    const emailInput = page.getByPlaceholder(/enter your email/i);
    const passwordInput = page.getByPlaceholder(/enter your password/i);
    const submitButton = page.getByLabel('Sign Up', { exact: true });
    const togglePasswordVisibility = page.getByRole('button', {
      name: 'toggle visibility',
    });
    await togglePasswordVisibility.click();
    await emailInput.fill(wrongFormatEmail);
    await passwordInput.fill(wrongFormatPassword);

    await expect(submitButton).toBeDisabled();
  });

  test('success info should be displayed on successful sign up - @desktop @tablet @mobile', async ({
    page,
  }) => {
    const workerIndex = test.info().workerIndex;
    const signUpPage: Route = '/dashboard/sign-up';
    const testUserEmail = workerIndex + process.env.SUPABASE_TEST_USER_EMAIL!;
    const testUserPassword = process.env.SUPABASE_TEST_USER_PASSWORD!;

    await page.goto(signUpPage);
    const emailInput = page.getByPlaceholder(/enter your email/i);
    const passwordInput = page.getByPlaceholder(/enter your password/i);
    const submitButton = page.getByLabel('Sign Up', { exact: true });
    const togglePasswordVisibility = page.getByRole('button', {
      name: 'toggle visibility',
    });
    await togglePasswordVisibility.click();
    await emailInput.fill(testUserEmail);
    await passwordInput.fill(testUserPassword);
    await submitButton.click();
    const successToast = page.getByLabel(/success notification/i);

    await expect(successToast).toBeInViewport();
    await expect(page).toHaveURL(signUpPage);

    await deleteTestUser(workerIndex);
  });

  test('success info should be displayed on existing user email sign up - @desktop @tablet @mobile', async ({
    page,
  }) => {
    const workerIndex = test.info().workerIndex;
    const { email, password } = await createTestUser(workerIndex);
    const signUpPage: Route = '/dashboard/sign-up';

    await page.goto(signUpPage);
    const emailInput = page.getByPlaceholder(/enter your email/i);
    const passwordInput = page.getByPlaceholder(/enter your password/i);
    const submitButton = page.getByLabel('Sign Up', { exact: true });
    const togglePasswordVisibility = page.getByRole('button', {
      name: 'toggle visibility',
    });
    await togglePasswordVisibility.click();
    await emailInput.fill(email);
    await passwordInput.fill(password);
    await submitButton.click();
    const successToast = page.getByLabel(/success notification/i);

    await expect(successToast).toBeInViewport();
    await expect(page).toHaveURL(signUpPage);

    await deleteTestUser(workerIndex);
  });
});
