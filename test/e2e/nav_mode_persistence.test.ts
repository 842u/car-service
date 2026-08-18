import type { Route } from 'next';

import { expect, test } from './fixtures';
import {
  NAV_RAIL_WIDTH,
  NAV_REVEALED_WIDTH,
  navModeTriggerLocator,
  navWidth,
  selectNavMode,
} from './nav-mode';

const DASHBOARD: Route = '/dashboard';

test.describe('nav_mode_persistence - @desktop @authenticated', () => {
  test('keeps the chosen mode across a reload - @desktop', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage.page;

    await selectNavMode(page, 'Expanded');
    await page.reload();

    await expect(navModeTriggerLocator(page)).toHaveAccessibleName(
      'Navigation menu mode: Expanded',
    );
    await expect.poll(() => navWidth(page)).toBe(NAV_REVEALED_WIDTH);
  });

  test('serves the chosen mode in the markup, before hydration - @desktop', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage.page;

    await selectNavMode(page, 'Expanded');

    // Read from the response body rather than the DOM: the point is that the
    // mode is already in the first frame, which a hydrated DOM cannot show.
    const response = await page.request.get(DASHBOARD);

    expect(await response.text()).toContain('data-nav-mode="expanded"');
  });

  test('serves auto when no mode has been chosen - @desktop', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage.page;

    const response = await page.request.get(DASHBOARD);

    expect(await response.text()).toContain('data-nav-mode="auto"');
  });

  test('falls back to auto for an unrecognised cookie value - @desktop', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage.page;

    await page.context().addCookies([
      {
        name: 'nav-mode',
        value: 'sideways',
        domain: 'localhost',
        path: '/',
      },
    ]);
    await page.goto(DASHBOARD);

    const response = await page.request.get(DASHBOARD);

    expect(await response.text()).toContain('data-nav-mode="auto"');
    await expect(navModeTriggerLocator(page)).toHaveAccessibleName(
      'Navigation menu mode: Auto',
    );
    await expect.poll(() => navWidth(page)).toBe(NAV_RAIL_WIDTH);
  });
});
