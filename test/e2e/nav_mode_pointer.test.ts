import type { Page } from '@playwright/test';

import { expect, test } from './fixtures';
import {
  NAV_RAIL_WIDTH,
  NAV_REVEALED_WIDTH,
  navLocator,
  navModePanelContainerLocator,
  navModePanelLocator,
  navModeTriggerLocator,
  navWidth,
  parkPointerClearOfNav,
  selectNavMode,
} from './nav-mode';

/**
 * Presses Tab once, which lands focus on the first control in the page.
 *
 * The focus hold reads `:focus-visible`, and focus moved by script inherits
 * the visibility of whatever held focus before it. Starting from a real key
 * press is what makes the `focus()` calls that follow count as a keyboard
 * user rather than as a click.
 */
async function tabIntoThePage(page: Page): Promise<void> {
  await page.keyboard.press('Tab');
}

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

  test('auto holds its reveal while focus is inside, and the focused item is legible - @desktop', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage.page;
    const nav = navLocator(page);

    await tabIntoThePage(page);
    await nav.getByRole('link', { name: 'Overview' }).focus();

    await expect.poll(() => navWidth(page)).toBe(NAV_REVEALED_WIDTH);
    // The reveal is what makes the item readable: at the resting width the
    // labels are transparent, so focus would land on a bare icon.
    await expect(nav.getByText('Overview', { exact: true })).toHaveCSS(
      'opacity',
      '1',
    );
  });

  test('auto collapses once focus leaves - @desktop', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage.page;
    const nav = navLocator(page);

    await tabIntoThePage(page);
    await nav.getByRole('link', { name: /sign out/i }).focus();

    await expect.poll(() => navWidth(page)).toBe(NAV_REVEALED_WIDTH);

    // Sign out is the nav's last control, so one Tab carries focus out of it.
    await page.keyboard.press('Tab');

    await expect.poll(() => navWidth(page)).toBe(NAV_RAIL_WIDTH);
  });

  test('auto holds its reveal while the mode panel is open, and the panel stays anchored - @desktop', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage.page;
    const trigger = navModeTriggerLocator(page);
    const panel = navModePanelLocator(page);

    await trigger.click();
    await parkPointerClearOfNav(page);

    await expect(panel).toBeVisible();
    await expect.poll(() => navWidth(page)).toBe(NAV_REVEALED_WIDTH);

    // The panel is placed once, against the trigger, and follows it only on
    // scroll and resize. Holding the nav open is what keeps the two together
    // after the pointer has left.
    const panelContainer = await navModePanelContainerLocator(page);
    const panelBox = await panelContainer.boundingBox();
    const triggerBox = await trigger.boundingBox();

    expect(panelBox?.x).toBeCloseTo(triggerBox?.x ?? 0, 0);
    expect((panelBox?.y ?? 0) + (panelBox?.height ?? 0)).toBeCloseTo(
      triggerBox?.y ?? 0,
      0,
    );
  });

  test('auto collapses once the panel is closed and focus leaves - @desktop', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage.page;
    const nav = navLocator(page);

    // Opened from the keyboard, and the pointer never moves, so the reveal
    // through this journey is the focus hold rather than a hover.
    await tabIntoThePage(page);
    await navModeTriggerLocator(page).focus();
    await page.keyboard.press('Enter');
    await expect(navModePanelLocator(page)).toBeVisible();

    await page.keyboard.press('Escape');

    // Closing hands focus back to the trigger, which is inside the nav, so the
    // reveal outlives the panel.
    await expect(navModePanelLocator(page)).toBeHidden();
    await expect.poll(() => navWidth(page)).toBe(NAV_REVEALED_WIDTH);

    await nav.getByRole('link', { name: /sign out/i }).focus();
    await page.keyboard.press('Tab');

    await expect.poll(() => navWidth(page)).toBe(NAV_RAIL_WIDTH);
  });

  test('auto collapses once a mode has been picked with the pointer - @desktop', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage.page;

    // Picking returns focus to the trigger, which is inside the nav. The hold
    // reads `:focus-visible`, which a click does not set, so the nav has
    // nothing left to hold it open once the pointer leaves.
    await selectNavMode(page, 'Auto');

    await expect.poll(() => navWidth(page)).toBe(NAV_RAIL_WIDTH);
  });

  test('collapsed is revealed by neither focus nor an open panel - @desktop', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage.page;
    const nav = navLocator(page);

    await selectNavMode(page, 'Collapsed');

    await tabIntoThePage(page);
    await nav.getByRole('link', { name: 'Overview' }).focus();

    await expect.poll(() => navWidth(page)).toBe(NAV_RAIL_WIDTH);

    await navModeTriggerLocator(page).click();
    await parkPointerClearOfNav(page);

    await expect(navModePanelLocator(page)).toBeVisible();
    await expect.poll(() => navWidth(page)).toBe(NAV_RAIL_WIDTH);
  });

  test('the reveal animates and a mode change does not - @desktop', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage.page;

    const transitioned = await navLocator(page).evaluate((nav) =>
      getComputedStyle(nav).transitionProperty.split(', '),
    );

    // `min-width` is what the reveal moves and `width` is what a mode sets.
    expect(transitioned).toContain('min-width');
    expect(transitioned).not.toContain('width');
  });

  test('the reveal does not animate under reduced motion - @desktop', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage.page;

    await page.emulateMedia({ reducedMotion: 'reduce' });

    await expect(navLocator(page)).toHaveCSS('transition-property', 'none');
  });
});
