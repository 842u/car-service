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

/**
 * The mode control's panel, named by the legend of the fieldset it wraps its
 * options in.
 */
export function navModePanelLocator(page: Page): Locator {
  return page.getByRole('group', { name: 'Navigation menu mode' });
}

/**
 * The panel's positioned container, found through the `aria-controls` the
 * trigger publishes while the panel is open.
 *
 * `navModePanelLocator` lands on the fieldset the options sit in, which is
 * inset from the container by its border and padding. Anchoring is a property
 * of the container, since that is the box the dropdown places against the
 * trigger.
 *
 * Matched on the `id` attribute rather than with `#`, because the id comes from
 * `useId` and carries characters a CSS id selector would have to escape.
 */
export async function navModePanelContainerLocator(
  page: Page,
): Promise<Locator> {
  const contentId =
    await navModeTriggerLocator(page).getAttribute('aria-controls');

  return page.locator(`[id="${contentId}"]`);
}

export async function navWidth(page: Page): Promise<number | undefined> {
  return (await navLocator(page).boundingBox())?.width;
}

/** Puts the pointer past the nav's widest, so nothing it does is a hover. */
export async function parkPointerClearOfNav(page: Page): Promise<void> {
  await page.mouse.move(NAV_REVEALED_WIDTH * 2, 5);
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

  await parkPointerClearOfNav(page);
}
