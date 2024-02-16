import { expect, test } from '@playwright/test';
import { Route } from 'next';

test('has title', async ({ page }) => {
  const homePagePath: Route = '/';

  await page.goto(homePagePath);

  await expect(page).toHaveTitle(/Create Next App/i);
});

test('should have dashboard link', async ({ page }) => {
  const homePagePath: Route = '/';

  await page.goto(homePagePath);

  const link = page.getByRole('link', { name: /dashboard/i });

  await expect(link).toBeVisible();
});
