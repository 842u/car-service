import type { Locator, Page } from '@playwright/test';
import type { Route } from 'next';

import { expect, keyboardTest as test } from './keyboard-navigation-fixtures';

// The fixture provisions an actor, a car, and two service logs over real API
// calls, then signs in through the UI, before the page under test even loads.
// Same reason the API project raises its own timeout.
test.describe.configure({ timeout: 40000 });

const MAX_TAB_STOPS = 40;

/**
 * Tabs until `target` holds focus. The panels under test put a varying number
 * of controls ahead of the one a journey wants (a sortable column adds two
 * sort buttons, a values filter adds an "All" box), so a hardcoded press count
 * would encode today's panel layout rather than the behaviour.
 */
async function pressTabUntilFocused(page: Page, target: Locator) {
  for (let stop = 0; stop < MAX_TAB_STOPS; stop++) {
    if (await target.evaluate((el) => el === document.activeElement)) return;

    await page.keyboard.press('Tab');
  }

  throw new Error(
    `Focus never reached the target within ${MAX_TAB_STOPS} tab stops.`,
  );
}

type FocusedElementState = {
  tag: string;
  label: string | undefined;
  hasIndicator: boolean;
};

/**
 * Describes whatever currently holds focus, or null once focus has left the
 * page and there is nothing further to walk.
 */
function readFocusedElement(page: Page): Promise<FocusedElementState | null> {
  return page.evaluate(() => {
    const element = document.activeElement;

    if (!element || element === document.body) return null;

    const wrapper = element.closest('.wrapper-focus-outline');

    return {
      tag: element.tagName,
      label:
        element.getAttribute('aria-label') ??
        element.textContent?.trim().slice(0, 40),
      // Either the control draws its own ring, or the wrapper that owns the
      // visible border draws it on the control's behalf. Asserting only the
      // former would fail on every composite input, where suppressing the
      // inner ring is the point.
      hasIndicator:
        getComputedStyle(element).outlineStyle !== 'none' ||
        (wrapper !== null && getComputedStyle(wrapper).outlineStyle !== 'none'),
    };
  });
}

/**
 * Tabs across the page and returns every stop it visited. Catches an
 * `outline-none` that reached the DOM through a variable or a template
 * literal, which the lint rule's string-literal selector cannot see.
 */
async function collectTabStops(page: Page): Promise<FocusedElementState[]> {
  const stops: FocusedElementState[] = [];

  for (let stop = 0; stop < MAX_TAB_STOPS; stop++) {
    await page.keyboard.press('Tab');

    const focused = await readFocusedElement(page);

    if (focused === null) break;

    stops.push(focused);
  }

  return stops;
}

/**
 * Stamps whatever holds focus so a later focus can be recognised as the same
 * element. Accessible names repeat across a table's headers, so they cannot
 * identify one tab stop on their own.
 */
function markFocused(page: Page, mark: string) {
  return page.evaluate(
    (value) => document.activeElement?.setAttribute('data-focus-mark', value),
    mark,
  );
}

function readFocusMark(page: Page) {
  return page.evaluate(
    () => document.activeElement?.getAttribute('data-focus-mark') ?? null,
  );
}

/**
 * True while focus is inside the panel the trigger controls. Goes through
 * getElementById rather than a locator: the id comes from React's useId, whose
 * delimiters are not valid in a CSS selector.
 */
function isFocusInPanel(page: Page, panelId: string) {
  return page.evaluate((id) => {
    const panel = document.getElementById(id);

    return panel !== null && panel.contains(document.activeElement);
  }, panelId);
}

/** Opens the trigger's panel and returns the panel's id. */
async function openPanel(trigger: Locator): Promise<string> {
  await trigger.focus();
  await trigger.page().keyboard.press('Enter');

  await expect(trigger).toHaveAttribute('aria-expanded', 'true');

  const panelId = await trigger.getAttribute('aria-controls');

  if (!panelId) throw new Error('An open trigger exposes no aria-controls.');

  return panelId;
}

/** Tabs forwards until focus is no longer anywhere inside the panel. */
async function pressTabUntilOutOfPanel(page: Page, panelId: string) {
  for (let stop = 0; stop < MAX_TAB_STOPS; stop++) {
    if (!(await isFocusInPanel(page, panelId))) return;

    await page.keyboard.press('Tab');
  }

  throw new Error(`Focus never left the panel within ${MAX_TAB_STOPS} stops.`);
}

/** True while focus sits on an element that is still attached to the document. */
function isFocusAttached(page: Page) {
  return page.evaluate(
    () =>
      document.activeElement !== null &&
      document.activeElement.isConnected &&
      document.activeElement !== document.documentElement,
  );
}

function carRoute(carId: string) {
  return `/dashboard/cars/${carId}` as Route;
}

const CARS_ROUTE: Route = '/dashboard/cars';

test.describe('keyboard_navigation - column dropdown - @desktop', () => {
  test('opens, filters, and restores focus without a pointer - @desktop', async ({
    keyboardPage,
  }) => {
    const { page, carId, filteredCategory, filteredRowCount } = keyboardPage;

    await page.goto(carRoute(carId));

    const table = page.getByRole('table', { name: 'car service logs' });
    await expect(table).toBeVisible();

    // Focus establishes where the keyboard journey starts. Everything that the
    // journey actually asserts happens through keystrokes from here.
    const trigger = page.getByRole('button', { name: 'Category', exact: true });
    await trigger.focus();

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await page.keyboard.press('Enter');

    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    // Opening puts focus on the panel container, so the next tab stop is the
    // panel's own first control.
    await page.keyboard.press('Tab');
    await expect(page.getByRole('checkbox', { name: 'All' })).toBeFocused();

    const categoryCheckbox = page.getByRole('checkbox', {
      name: filteredCategory,
      exact: true,
    });

    await pressTabUntilFocused(page, categoryCheckbox);
    await page.keyboard.press('Space');

    await expect(categoryCheckbox).toBeChecked();
    await expect(table.locator('tbody tr')).toHaveCount(filteredRowCount);

    await page.keyboard.press('Escape');

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();
  });
});

test.describe('keyboard_navigation - panel tab boundary - @desktop', () => {
  // The panel is portaled to the end of the body, so DOM order would otherwise
  // send a Tab off its last control past the whole page and a Shift+Tab back
  // into it. Both journeys assert the page keeps tabbing from the trigger's
  // own place instead. jsdom cannot observe either: they rest on the browser
  // resolving Tab's default action against the focus the handler just moved.
  test('tabbing off the panel resumes after the trigger and closes it - @desktop', async ({
    keyboardPage,
  }) => {
    const { page, carId } = keyboardPage;

    await page.goto(carRoute(carId));

    await expect(
      page.getByRole('table', { name: 'car service logs' }),
    ).toBeVisible();

    const trigger = page.getByRole('button', { name: 'Category', exact: true });

    // Where Tab lands from the closed trigger is the reference the journey has
    // to match, and it is read before the panel exists so nothing about the
    // panel's own position can decide it.
    await trigger.focus();
    await page.keyboard.press('Tab');
    await markFocused(page, 'after-trigger');

    const panelId = await openPanel(trigger);

    await pressTabUntilOutOfPanel(page, panelId);

    expect(await isFocusAttached(page)).toBe(true);
    expect(await readFocusMark(page)).toBe('after-trigger');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('shift-tabbing off the panel resumes before the trigger and closes it - @desktop', async ({
    keyboardPage,
  }) => {
    const { page, carId } = keyboardPage;

    await page.goto(carRoute(carId));

    await expect(
      page.getByRole('table', { name: 'car service logs' }),
    ).toBeVisible();

    const trigger = page.getByRole('button', { name: 'Category', exact: true });

    await trigger.focus();
    await page.keyboard.press('Shift+Tab');
    await markFocused(page, 'before-trigger');

    await openPanel(trigger);

    // Opening leaves focus on the panel container, which is already the
    // backwards boundary: its tabindex of -1 keeps it out of the sequential
    // order, so one Shift+Tab leaves the panel outright.
    await page.keyboard.press('Shift+Tab');

    expect(await isFocusAttached(page)).toBe(true);
    expect(await readFocusMark(page)).toBe('before-trigger');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});

test.describe('keyboard_navigation - row actions - @desktop', () => {
  test('opens the edit modal from a row action - @desktop', async ({
    keyboardPage,
  }) => {
    const { page, carId } = keyboardPage;

    await page.goto(carRoute(carId));

    const table = page.getByRole('table', { name: 'car service logs' });
    await expect(table).toBeVisible();

    const actionsTrigger = table
      .getByRole('button', { name: 'Actions' })
      .first();

    // The row's actions stay disabled until the permission query resolves.
    await expect(actionsTrigger).toBeEnabled();
    await actionsTrigger.focus();

    await page.keyboard.press('Enter');
    await expect(actionsTrigger).toHaveAttribute('aria-expanded', 'true');

    // `exact` matters: the car details section has an "Edit car" button, and
    // Playwright matches accessible names by substring.
    const editButton = page.getByRole('button', { name: 'Edit', exact: true });

    await pressTabUntilFocused(page, editButton);
    await page.keyboard.press('Enter');

    const dialog = page.getByRole('dialog', { name: 'Edit service log' });
    await expect(dialog).toBeVisible();

    const focusEnteredDialog = await dialog.evaluate((el) =>
      el.contains(document.activeElement),
    );
    expect(focusEnteredDialog).toBe(true);

    await page.keyboard.press('Escape');

    await expect(dialog).toBeHidden();
  });
});

test.describe('keyboard_navigation - modal dismissal - @desktop', () => {
  test('escape closes the delete modal and leaves focus attached - @desktop', async ({
    keyboardPage,
  }) => {
    const { page, carId } = keyboardPage;

    await page.goto(carRoute(carId));

    const deleteButton = page.getByRole('button', {
      name: 'Delete car',
      exact: true,
    });

    // Gated by an async primary-owner check that resolves separately from the
    // section's own loading state; focusing early no-ops on a disabled button.
    await expect(deleteButton).toBeEnabled();
    await deleteButton.focus();

    await page.keyboard.press('Enter');

    const dialog = page.getByRole('dialog', { name: 'Delete car' });
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(dialog).toBeHidden();
    expect(await isFocusAttached(page)).toBe(true);
  });
});

test.describe('keyboard_navigation - add card - @desktop', () => {
  test('space on the add-car card opens the add modal - @desktop', async ({
    keyboardPage,
  }) => {
    const { page } = keyboardPage;

    await page.goto(CARS_ROUTE);

    // Regression test for the card going back to a div with role="button",
    // which looks focusable and does nothing on Space.
    const addCard = page.getByRole('button', { name: /add a car/i });
    await expect(addCard).toBeVisible();
    await addCard.focus();

    await page.keyboard.press('Space');

    await expect(page.getByRole('dialog', { name: 'Add car' })).toBeVisible();
  });
});

test.describe('keyboard_navigation - focus indicator - @desktop', () => {
  test('every tab stop on the gallery is indicated - @desktop', async ({
    keyboardPage,
  }) => {
    const { page } = keyboardPage;

    await page.goto(CARS_ROUTE);

    await expect(
      page.getByRole('button', { name: /add a car/i }),
    ).toBeVisible();

    const stops = await collectTabStops(page);

    expect(stops.length).toBeGreaterThan(0);

    const unindicated = stops
      .filter((stop) => !stop.hasIndicator)
      .map((stop) => `${stop.tag} "${stop.label}"`);

    // This catches a missing indicator, not a sufficient one. A ring with no
    // contrast against its background still passes; a tab walk cannot judge
    // that.
    expect(unindicated, 'tab stops with no focus indicator').toEqual([]);
  });
});
