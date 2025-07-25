import { Route } from 'next';

type Routes = Route[];

export const publicRoutes: Routes = ['/'];

export const unauthenticatedOnlyRoutes: Routes = [
  '/dashboard/sign-in',
  '/dashboard/sign-up',
  '/dashboard/forgot-password',
];

export const authenticatedOnlyRoutes: Routes = [
  '/dashboard',
  '/dashboard/account',
  '/dashboard/cars',
];

export const authenticatedOnlyDynamicRoutes: Routes = ['/dashboard/cars'];

export function getRouteAccessRedirection(
  isAuthenticated: boolean,
  route: Route,
): Route | undefined {
  const isRoutePublic = publicRoutes.includes(route);
  const isRouteUnauthOnly = unauthenticatedOnlyRoutes.includes(route);
  const isRouteAuthOnly = authenticatedOnlyRoutes.includes(route);
  const isRouteDynamicAuthOnly = authenticatedOnlyDynamicRoutes.some(
    (dynamicRoute) => route.startsWith(dynamicRoute),
  );

  if (!isAuthenticated && !isRoutePublic && !isRouteUnauthOnly) {
    return '/dashboard/sign-in';
  }

  if (
    isAuthenticated &&
    !isRoutePublic &&
    !isRouteAuthOnly &&
    !isRouteDynamicAuthOnly
  ) {
    return '/dashboard';
  }

  return;
}
