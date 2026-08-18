import { expect, test } from './fixtures';
import {
  NAV_RAIL_WIDTH,
  NAV_REVEALED_WIDTH,
  navLocator,
  navWidth,
  selectNavMode,
} from './nav-mode';

test.describe('nav_mode_pointer - @desktop @authenticated', () => {
  test('auto rests narrow, widens under the pointer, and covers nothing - @desktop', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage.page;
    const nav = navLocator(page);
    const main = page.getByRole('main');

    await expect.poll(() => navWidth(page)).toBe(NAV_RAIL_WIDTH);

    await nav.hover();

    await expect.poll(() => navWidth(page)).toBe(NAV_REVEALED_WIDTH);
    await expect(nav.getByRole('link', { name: /overview/i })).toBeVisible();
    // The reveal floats: nothing the user is reading gives up width for it.
    await expect(main).toHaveCSS('padding-left', `${NAV_RAIL_WIDTH}px`);
  });

  test('collapsed does not widen under the pointer - @desktop', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage.page;
    const nav = navLocator(page);

    await selectNavMode(page, 'Collapsed');

    await expect.poll(() => navWidth(page)).toBe(NAV_RAIL_WIDTH);

    await nav.hover();

    await expect.poll(() => navWidth(page)).toBe(NAV_RAIL_WIDTH);
  });

  test('expanded stays wide and the main region gives up the width - @desktop', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage.page;
    const nav = navLocator(page);
    const main = page.getByRole('main');

    await selectNavMode(page, 'Expanded');

    await expect.poll(() => navWidth(page)).toBe(NAV_REVEALED_WIDTH);
    await expect(nav.getByRole('link', { name: /overview/i })).toBeVisible();
    await expect(main).toHaveCSS('padding-left', `${NAV_REVEALED_WIDTH}px`);

    await nav.hover();

    await expect.poll(() => navWidth(page)).toBe(NAV_REVEALED_WIDTH);
  });

  test('a mode change takes effect without a round trip - @desktop', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage.page;

    let navigated = false;
    page.on('framenavigated', () => {
      navigated = true;
    });

    await selectNavMode(page, 'Expanded');

    await expect.poll(() => navWidth(page)).toBe(NAV_REVEALED_WIDTH);
    expect(navigated).toBe(false);
  });
});
