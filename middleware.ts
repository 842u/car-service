import { createServerClient } from '@supabase/ssr';
import { Route } from 'next';
import { type NextRequest, NextResponse } from 'next/server';

import { Database } from './types/supabase';
import { generateCspWithNonce } from './utils/security.mjs';

export async function middleware(request: NextRequest) {
  const { csp, nonce } = generateCspWithNonce();
  const requestUrl = request.nextUrl.clone();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('content-security-policy', csp);

  let response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const { auth } = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request: { headers: requestHeaders },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await auth.getUser();

  if (
    !user &&
    requestUrl.pathname !== ('/' as Route) &&
    requestUrl.pathname !== ('/dashboard/forgot-password' as Route) &&
    requestUrl.pathname !== ('/dashboard/sign-up' as Route) &&
    requestUrl.pathname !== ('/dashboard/sign-in' as Route)
  ) {
    response = NextResponse.redirect(
      new URL('/dashboard/sign-in' as Route, requestUrl.origin),
      {
        headers: requestHeaders,
      },
    );
  }

  if (
    user &&
    (requestUrl.pathname === ('/dashboard/forgot-password' as Route) ||
      requestUrl.pathname === ('/dashboard/sign-up' as Route) ||
      requestUrl.pathname === ('/dashboard/sign-in' as Route))
  ) {
    response = NextResponse.redirect(
      new URL('/dashboard/account' as Route, requestUrl.origin),
      {
        headers: requestHeaders,
      },
    );
  }

  /*
   * CSP needs to be set twice, see more:
   * https://github.com/vercel/next.js/issues/43743#issuecomment-1542712188
   * In the docs, response headers are also set before returing response:
   * https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy#adding-a-nonce-with-middleware
   */
  response.headers.set('x-nonce', nonce);
  response.headers.set('content-security-policy', csp);

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
     * - robots.txt
     */
    {
      source:
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    },
  ],
};
