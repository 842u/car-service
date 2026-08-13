import type { Locator, Page } from '@playwright/test';
import { expect, test as base } from '@playwright/test';
import type { Route } from 'next';

import {
  createTestUserByEmail,
  deleteTestUserByEmail,
  generateTestEmail,
} from './test-user';

export class AuthenticatedPage {
  public readonly page: Page;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly passwordVisibilityButton: Locator;
  private readonly singInButton: Locator;

  constructor(pageInstance: Page) {
    this.page = pageInstance;
    this.passwordVisibilityButton = this.page.getByRole('button', {
      name: 'toggle visibility',
    });
    this.emailInput = this.page.getByPlaceholder(/enter your email/i);
    this.passwordInput = this.page.getByPlaceholder(/enter your password/i);
    this.singInButton = this.page.getByRole('button', { name: /sign in/i });
  }

  async signIn(email: string, password: string) {
    const signInPage: Route = '/dashboard/sign-in';

    await this.page.goto(signInPage);
    await this.passwordVisibilityButton.click();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.singInButton.click();

    await expect(this.page).toHaveURL('/dashboard' satisfies Route);
  }
}

type ToastType = 'info' | 'success' | 'error' | 'warning';

/**
 * Locates a toast by the type prefix carried in its message.
 *
 * The toast `<li>` has no accessible name to match on: `listitem` does not
 * compute one from its content, and the toaster announces the message through
 * its live region rather than labelling each item. The type reaches assistive
 * tech as a screen-reader-only prefix on the message text, which is the only
 * thing that distinguishes a success toast from an error one.
 */
export function toastLocator(page: Page, type: ToastType): Locator {
  return page
    .getByRole('region', { name: 'notifications' })
    .getByRole('listitem')
    .filter({ hasText: new RegExp(`^${type}:`, 'i') });
}

type TestUserCredentials = {
  email: string;
  password: string;
};

export const test = base.extend<{
  authenticatedPage: AuthenticatedPage;
  testUserAccountCredentials: TestUserCredentials;
  freshUserCredentials: TestUserCredentials;
}>({
  authenticatedPage: async ({ page, testUserAccountCredentials }, use) => {
    const { email, password } = testUserAccountCredentials;

    const authenticatedPage = new AuthenticatedPage(page);
    await authenticatedPage.signIn(email, password);

    await use(authenticatedPage);
  },

  testUserAccountCredentials: async ({}, use) => {
    const email = generateTestEmail();
    const password = process.env.SUPABASE_TEST_USER_PASSWORD!;

    await createTestUserByEmail(email);
    await use({ email, password });
    await deleteTestUserByEmail(email);
  },

  freshUserCredentials: async ({}, use) => {
    const email = generateTestEmail();
    const password = process.env.SUPABASE_TEST_USER_PASSWORD!;

    await use({ email, password });
    await deleteTestUserByEmail(email);
  },
});
export { expect } from '@playwright/test';
