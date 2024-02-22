import { Route } from 'next';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { generateCspWithNonce } from '@/utils/security.mjs';

import { getAuthenticatedRedirectPath } from './utils/middleware';
import { getUserSession } from './utils/supabase';

export async function middleware(request: NextRequest) {
  const requestUrl = request.nextUrl.clone();
  const requestHeaders = new Headers(request.headers);
  const { csp, nonce } = generateCspWithNonce();

  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('content-security-policy', csp);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  /*
   * Needs to be set twice, see more:
   * https://github.com/vercel/next.js/issues/43743#issuecomment-1542712188
   */
  response.headers.set('content-security-policy', csp);

  const { user } = await getUserSession(request, requestHeaders);
  const redirectPath = getAuthenticatedRedirectPath(
    user,
    requestUrl.pathname as Route,
  );

  if (redirectPath) {
    return NextResponse.redirect(new URL(redirectPath, requestUrl.origin), {
      headers: requestHeaders,
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
