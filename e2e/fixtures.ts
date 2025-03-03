import { expect, Locator, Page, test as base } from '@playwright/test';
import { Route } from 'next';

import { createTestUser, deleteTestUser } from '@/utils/supabase/general';

class AuthenticatedPage {
  public readonly page: Page;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly passwordVisibilityButton: Locator;
  private readonly singInButton: Locator;

  constructor(pageInstance: Page) {
    this.page = pageInstance;
    this.passwordVisibilityButton = this.page.getByLabel(/toggle visibility/i);
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

type TestUserAccountCredentials = {
  email: string;
  password: string;
};

export const test = base.extend<
  { authenticatedPage: AuthenticatedPage },
  { testUserAccountCredentials: TestUserAccountCredentials }
>({
  authenticatedPage: async (
    { page, testUserAccountCredentials: testUserAccount },
    use,
  ) => {
    const { email, password } = testUserAccount;

    const authenticatedPage = new AuthenticatedPage(page);
    await authenticatedPage.signIn(email, password);

    // eslint-disable-next-line
    await use(authenticatedPage);
  },

  testUserAccountCredentials: [
    // eslint-disable-next-line
    async ({}, use, workerInfo) => {
      const workerIndex = workerInfo.workerIndex;

      const { email, password } = await createTestUser(workerIndex);

      await use({ email, password });

      await deleteTestUser(workerIndex);
    },
    { scope: 'worker' },
  ],
});
export { expect } from '@playwright/test';
