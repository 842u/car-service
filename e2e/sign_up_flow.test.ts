import test, { expect } from '@playwright/test';
import { Route } from 'next';

import { createTestUser, deleteTestUser } from '@/utils/supabase/general';

test.describe('sign_up_flow - @unauthenticated', () => {
  // For some reason, the webkit browser requires input to be set to a textbox instead of a password. It may not be able to read the value of the password type.

  test('submit button should be disabled if sign up email auth form is filled incorrectly - @desktop @tablet @mobile', async ({
    page,
  }) => {
    const signUpPage: Route = '/dashboard/sign-up';
    const wrongFormatEmail = 'wrong@email';
    const wrongFormatPassword = 'wrong';

    await page.goto(signUpPage);
    const emailInput = page.getByPlaceholder(/enter your email/i);
    const passwordInput = page.getByPlaceholder(/enter your password/i);
    const submitButton = page.getByLabel('Sign Up', { exact: true });

    const togglePasswordVisibility = page.getByLabel(/toggle visibility/i);
    await togglePasswordVisibility.click();
    await emailInput.fill(wrongFormatEmail);
    await passwordInput.fill(wrongFormatPassword);

    await expect(submitButton).toBeDisabled();
    await expect(page).toHaveURL(signUpPage);
  });

  test('on successful sign up success info should be displayed - @desktop @tablet @mobile', async ({
    page,
  }) => {
    const signUpPage: Route = '/dashboard/sign-up';
    const testUserIndex = test.info().workerIndex;
    const testUserEmail = testUserIndex + process.env.SUPABASE_TEST_USER_EMAIL!;
    const testUserPassword = process.env.SUPABASE_TEST_USER_PASSWORD!;

    await page.goto(signUpPage);
    const emailInput = page.getByPlaceholder(/enter your email/i);
    const passwordInput = page.getByPlaceholder(/enter your password/i);
    const submitButton = page.getByLabel('Sign Up', { exact: true });
    const togglePasswordVisibility = page.getByLabel(/toggle visibility/i);
    await togglePasswordVisibility.click();
    await emailInput.fill(testUserEmail);
    await passwordInput.fill(testUserPassword);
    await submitButton.click();
    const successToast = page.getByLabel(/success notification/i);

    await expect(successToast).toBeInViewport();
    await expect(page).toHaveURL(signUpPage);

    await deleteTestUser(testUserIndex);
  });

  test('on existing user email sign up success info should be displayed - @desktop @tablet @mobile', async ({
    page,
  }) => {
    const testUserIndex = test.info().workerIndex;
    await createTestUser(testUserIndex);
    const signUpPage: Route = '/dashboard/sign-up';
    const testUserEmail = testUserIndex + process.env.SUPABASE_TEST_USER_EMAIL!;
    const testUserPassword = process.env.SUPABASE_TEST_USER_PASSWORD!;

    await page.goto(signUpPage);
    const emailInput = page.getByPlaceholder(/enter your email/i);
    const passwordInput = page.getByPlaceholder(/enter your password/i);
    const submitButton = page.getByLabel('Sign Up', { exact: true });
    const togglePasswordVisibility = page.getByLabel(/toggle visibility/i);
    await togglePasswordVisibility.click();
    await emailInput.fill(testUserEmail);
    await passwordInput.fill(testUserPassword);
    await submitButton.click();
    const successToast = page.getByLabel(/success notification/i);

    await expect(successToast).toBeInViewport();
    await expect(page).toHaveURL(signUpPage);

    await deleteTestUser(testUserIndex);
  });
});
