import type { Locator, Page } from '@playwright/test';

/** The nav's resting width above `md`, and the width a reveal takes it to. */
export const NAV_RAIL_WIDTH = 64;
export const NAV_REVEALED_WIDTH = 224;

export function navLocator(page: Page): Locator {
  return page.getByRole('navigation', { name: 'dashboard navigation menu' });
}

export function navModeTriggerLocator(page: Page): Locator {
  return page.getByRole('button', { name: /^navigation menu mode:/i });
}

export async function navWidth(page: Page): Promise<number | undefined> {
  return (await navLocator(page).boundingBox())?.width;
}

/**
 * Picks a mode and leaves the pointer well clear of the nav.
 *
 * Picking closes the panel on its own, but the pointer stays where the option
 * was, and the panel opens from a trigger inside the nav, so that position can
 * be over the nav itself. The browser re-runs its hit test there once the panel
 * closes, which in `auto` reveals the nav. Parking the pointer past the nav's
 * widest is what lets the assertions that follow read a resting width rather
 * than a revealed one.
 *
 * Twice that width is a coordinate every viewport these specs run under can
 * hold: the narrowest is 1280 across.
 */
export async function selectNavMode(page: Page, label: string): Promise<void> {
  await navModeTriggerLocator(page).click();
  await page.getByRole('button', { name: label, exact: true }).click();

  await page.mouse.move(NAV_REVEALED_WIDTH * 2, 5);
}
