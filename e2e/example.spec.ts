import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Create Next App/i);
});

test('should have dashboard link', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Click the get started link.
  const link = page.getByRole('link', { name: /dashboard/i });

  // Expects page to have a heading with the name of Installation.
  await expect(link).toBeVisible();
});
