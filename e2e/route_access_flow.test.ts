import { Route } from 'next';

import {
  authenticatedOnlyDynamicRoutes,
  authenticatedOnlyRoutes,
  publicRoutes,
  unauthenticatedOnlyRoutes,
} from '../src/middleware';
import { expect, test } from './fixtures';

test.describe('route_access_flow - @unauthenticated', () => {
  test('unauthenticated user can visit public routes - @mobile @tablet @desktop', async ({
    page,
  }) => {
    for await (const route of publicRoutes) {
      await page.goto(route);

      await expect(page).toHaveURL(route);
    }
  });

  test('unauthenticated user can visit unauthenticated only routes - @mobile @tablet @desktop', async ({
    page,
  }) => {
    for await (const route of unauthenticatedOnlyRoutes) {
      await page.goto(route);

      await expect(page).toHaveURL(route);
    }
  });

  test('unauthenticated user should be redirected when accessing authenticated only routes - @mobile @tablet @desktop', async ({
    page,
  }) => {
    const redirectionRoute: Route = '/dashboard/sign-in';
    const dynamicRouteSegment = '/some_random_id';

    for await (const route of authenticatedOnlyRoutes) {
      await page.goto(route);

      await expect(page).toHaveURL(redirectionRoute);
    }

    for await (const dynamicRoute of authenticatedOnlyDynamicRoutes) {
      await page.goto(`${dynamicRoute}${dynamicRouteSegment}`);

      await expect(page).toHaveURL(redirectionRoute);
    }
  });
});

test.describe('route_access_flow - @authenticated', () => {
  test('authenticated user can visit public routes - @mobile @tablet @desktop', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage.page;

    for await (const route of publicRoutes) {
      await page.goto(route);

      await expect(page).toHaveURL(route);
    }
  });

  test('authenticated user can visit authenticated only routes - @mobile @tablet @desktop', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage.page;

    for await (const route of authenticatedOnlyRoutes) {
      await page.goto(route);

      await expect(page).toHaveURL(route);
    }
  });

  test("authenticated user can't' visit a car page which he isn't an owner - @mobile @tablet @desktop", async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage.page;
    const dynamicRouteSegment = '/some_random_id';

    for await (const route of authenticatedOnlyDynamicRoutes) {
      const dynamicRoute = route + dynamicRouteSegment;

      await page.goto(dynamicRoute);

      await expect(page).toHaveURL('/dashboard/cars' satisfies Route);
    }
  });

  test('authenticated user should be redirected when accessing unauthenticated only routes - @mobile @tablet @desktop', async ({
    authenticatedPage,
  }) => {
    const page = authenticatedPage.page;
    const redirectionRoute: Route = '/dashboard';

    for await (const route of unauthenticatedOnlyRoutes) {
      await page.goto(route);

      await expect(page).toHaveURL(redirectionRoute);
    }
  });
});
