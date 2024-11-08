import { expect, test as setup } from '@playwright/test';
import { Route } from 'next';
import path from 'path';

import { createTestUser, deleteTestUser } from '@/utils/supabase/general';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate - @authenticated', async ({ page }) => {
  await deleteTestUser();
  await createTestUser();
  const dashboardPath: Route = '/dashboard';
  const signInPath: Route = '/dashboard/sign-in';
  const testUserEmail = process.env.SUPABASE_TEST_USER_EMAIL!;
  const testUserPassword = process.env.SUPABASE_TEST_USER_PASSWORD!;

  await page.goto(signInPath);
  const emailInput = page.getByPlaceholder(/enter your email/i);
  await emailInput.pressSequentially(testUserEmail);
  const passwordInput = page.getByPlaceholder(/enter your password/i);
  await passwordInput.pressSequentially(testUserPassword);
  await page.getByRole('button', { name: 'Sign in' }).click();
  const successToast = page.getByLabel(/success notification/i);

  await expect(successToast).toBeInViewport();
  await expect(page).toHaveURL(dashboardPath);

  await page.context().storageState({ path: authFile });
});
