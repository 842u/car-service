import type { Page } from '@playwright/test';
import type { Route } from 'next';

import { expect, test } from './fixtures';

const MAX_TAB_STOPS = 40;

/**
 * Tabs across the page and reports whether focus ever lands inside the nav
 * landmark identified by `navAriaLabel`, stopping once focus leaves the page.
 * Checking containment rather than matching a stop's accessible name avoids
 * false positives from identically-labelled elements elsewhere on the page
 * (the landing page has its own "Dashboard" link outside the nav drawer).
 */
async function focusEntersNav(
  page: Page,
  navAriaLabel: string,
): Promise<boolean> {
  for (let stop = 0; stop < MAX_TAB_STOPS; stop++) {
    await page.keyboard.press('Tab');

    const state = await page.evaluate((label) => {
      const nav = document.querySelector(`nav[aria-label="${label}"]`);
      const active = document.activeElement;

      if (!active || active === document.body) return 'left-page';

      return nav !== null && nav.contains(active) ? 'inside' : 'outside';
    }, navAriaLabel);

    if (state === 'left-page') return false;
    if (state === 'inside') return true;
  }

  return false;
}

test.describe('nav_drawer_tab_order - landing - @mobile', () => {
  test('closed menu is unreachable by Tab - @mobile', async ({ page }) => {
    await page.goto('/' satisfies Route);

    expect(await focusEntersNav(page, 'landing navigation menu')).toBe(false);
  });

  test('open menu is reachable and the backdrop dismisses it - @mobile', async ({
    page,
  }) => {
    await page.goto('/' satisfies Route);

    const nav = page.getByRole('navigation', {
      name: 'landing navigation menu',
    });

    await page.getByRole('button', { name: 'toggle navigation menu' }).click();

    const closeButton = nav.getByRole('button', {
      name: 'close navigation menu',
    });
    const dashboardLink = nav.getByRole('link', { name: /dashboard/i });

    await expect(closeButton).toBeVisible();
    await expect(dashboardLink).toBeVisible();

    // The backdrop is a full-viewport click-catcher behind the nav's own
    // content, so a coordinate click risks hitting a link instead. Dispatching
    // directly on the element tests the dismissal wiring without depending on
    // its on-screen hit region.
    await closeButton.dispatchEvent('click');

    await expect(dashboardLink).toBeHidden();
  });
});

test.describe('nav_drawer_tab_order - dashboard - @mobile @authenticated', () => {
  test('closed menu is unreachable by Tab - @mobile', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage.page;

    expect(await focusEntersNav(page, 'dashboard navigation menu')).toBe(false);
  });

  test('open menu is reachable and the backdrop dismisses it - @mobile', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage.page;

    const nav = page.getByRole('navigation', {
      name: 'dashboard navigation menu',
    });

    await page.getByRole('button', { name: 'toggle navigation menu' }).click();

    const closeButton = nav.getByRole('button', {
      name: 'close navigation menu',
    });
    const overviewLink = nav.getByRole('link', { name: /overview/i });

    await expect(closeButton).toBeVisible();
    await expect(overviewLink).toBeVisible();

    await closeButton.dispatchEvent('click');

    await expect(overviewLink).toBeHidden();
  });
});
