import type { Page } from '@playwright/test';
import { test as base } from '@playwright/test';

import {
  createApiActor,
  createCar,
  createServiceLog,
  deleteTestCar,
  disposeApiActor,
} from './api-fixtures';
import { AuthenticatedPage } from './fixtures';

/**
 * Two logs under different categories. Ticking one category box has to leave a
 * strictly smaller set of rows behind, which a single log cannot demonstrate.
 */
const UNFILTERED_CATEGORY = 'other';
const FILTERED_CATEGORY = 'engine';

export type KeyboardTestContext = {
  page: Page;
  carId: string;
  /** The category whose checkbox the column dropdown journey ticks. */
  filteredCategory: string;
  /** How many rows survive that filter. */
  filteredRowCount: number;
};

/**
 * A signed-in browser page on a car that already has data to navigate.
 *
 * `fixtures.ts` signs a page in but only ever provisions a bare account, and
 * `api-fixtures.ts` builds real car graphs but has no browser page. This
 * composes both: the graph is provisioned over the API, far fewer round trips
 * than driving the write forms, and then the page signs in through the UI as
 * its owner.
 *
 * One actor is enough. A service log row's actions are enabled for the primary
 * owner regardless of who authored the log, so no co-owner is needed.
 */
export const keyboardTest = base.extend<{ keyboardPage: KeyboardTestContext }>({
  keyboardPage: async ({ page }, use) => {
    const owner = await createApiActor();
    let carId: string | undefined;

    try {
      carId = await createCar(owner, 'E2E keyboard-navigation car');

      await createServiceLog(owner, carId, [UNFILTERED_CATEGORY]);
      await createServiceLog(owner, carId, [FILTERED_CATEGORY]);

      const authenticatedPage = new AuthenticatedPage(page);

      await authenticatedPage.signIn(
        owner.email,
        process.env.SUPABASE_TEST_USER_PASSWORD!,
      );

      await use({
        page,
        carId,
        filteredCategory: FILTERED_CATEGORY,
        filteredRowCount: 1,
      });
    } finally {
      if (carId) await deleteTestCar(carId);
      await disposeApiActor(owner);
    }
  },
});

export { expect } from '@playwright/test';
