import type { Route } from 'next';

import { wrongEmails } from '@/user/domain/user/value-object/email/email.samples';

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
    const submitButton = page.getByRole('button', { name: 'Sign Up' });
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
    freshUserCredentials,
  }) => {
    const { email, password } = freshUserCredentials;
    const signUpPage: Route = '/dashboard/sign-up';

    await page.goto(signUpPage);
    const emailInput = page.getByPlaceholder(/enter your email/i);
    const passwordInput = page.getByPlaceholder(/enter your password/i);
    const submitButton = page.getByRole('button', { name: 'Sign Up' });
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
  });

  test('success info should be displayed on existing user email sign up - @desktop @tablet @mobile', async ({
    page,
    testUserAccountCredentials,
  }) => {
    const { email, password } = testUserAccountCredentials;
    const signUpPage: Route = '/dashboard/sign-up';

    await page.goto(signUpPage);
    const emailInput = page.getByPlaceholder(/enter your email/i);
    const passwordInput = page.getByPlaceholder(/enter your password/i);
    const submitButton = page.getByRole('button', { name: 'Sign Up' });
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
  });
});
