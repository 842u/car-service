import { User } from '@supabase/supabase-js';
import { Route } from 'next';

export function getAuthenticatedRedirectPath(
  user: User | null,
  requestPath: Route,
) {
  let redirectToPath: Route;

  if (!user) {
    if (
      requestPath !== '/' &&
      requestPath !== '/dashboard/sign-in' &&
      requestPath !== '/dashboard/sign-up' &&
      requestPath !== '/dashboard/forgot-password'
    ) {
      redirectToPath = '/dashboard/sign-in' as Route;

      return redirectToPath;
    }
  }

  if (user) {
    if (
      (!requestPath.includes('/dashboard') && requestPath !== '/') ||
      requestPath === '/dashboard/sign-in' ||
      requestPath === '/dashboard/sign-up' ||
      requestPath === '/dashboard/forgot-password'
    ) {
      redirectToPath = '/dashboard' as Route;

      return redirectToPath;
    }
  }
}
