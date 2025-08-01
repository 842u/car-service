import type { Route } from 'next';

import { expect, test } from './fixtures';

test.describe('sign_out_flow - @authenticated', () => {
  test('should sign out user on sign out click - @mobile', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage.page;
    const dashboardPath: Route = '/dashboard';

    await page.goto(dashboardPath);
    const hamburgerButton = page.getByRole('button', {
      name: 'toggle navigation menu',
    });
    await hamburgerButton.click();
    const signOutLink = page.getByRole('link', { name: /Sign Out/i });
    await signOutLink.click();

    await expect(page).toHaveURL('/' satisfies Route);
    expect((await page.context().cookies()).length).toBe(0);
  });

  test('should sign out user on sign out click - @desktop @tablet', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage.page;
    const dashboardPath: Route = '/dashboard';

    await page.goto(dashboardPath);
    const signOutLink = page.getByRole('link', { name: /Sign Out/i });
    await signOutLink.click();

    await expect(page).toHaveURL('/' satisfies Route);
    expect((await page.context().cookies()).length).toBe(0);
  });
});
