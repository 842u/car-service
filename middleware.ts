import { createServerClient } from '@supabase/ssr';
import { Route } from 'next';
import { type NextRequest, NextResponse } from 'next/server';

import { Database } from './src/types/supabase';
import { generateCspStringWithNonce } from './src/utils/security.mjs';

export const publicRoutes: Route[] = ['/'];

export const unauthenticatedOnlyRoutes: Route[] = [
  '/dashboard/sign-in',
  '/dashboard/sign-up',
  '/dashboard/forgot-password',
];

export const authenticatedOnlyRoutes: Route[] = [
  '/dashboard',
  '/dashboard/account',
  '/dashboard/cars',
];

export const authenticatedOnlyDynamicRoutes: Route[] = ['/dashboard/cars'];

export async function middleware(request: NextRequest) {
  const { cspString, nonce } = generateCspStringWithNonce();
  const requestUrl = request.nextUrl.clone();
  const requestPath = requestUrl.pathname as Route;

  const responseHeaders = new Headers(request.headers);
  responseHeaders.set('x-nonce', nonce);
  responseHeaders.set('content-security-policy', cspString);

  const response = NextResponse.next({ request, headers: responseHeaders });

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
    !publicRoutes.includes(requestPath) &&
    !unauthenticatedOnlyRoutes.includes(requestPath)
  ) {
    return NextResponse.redirect(
      new URL('/dashboard/sign-in' satisfies Route, requestUrl.origin),
      { headers: responseHeaders },
    );
  }

  if (
    user &&
    !publicRoutes.includes(requestPath) &&
    !authenticatedOnlyRoutes.includes(requestPath) &&
    !authenticatedOnlyDynamicRoutes.some((route) =>
      requestPath.startsWith(route),
    )
  ) {
    return NextResponse.redirect(
      new URL('/dashboard' satisfies Route, requestUrl.origin),
      { headers: responseHeaders },
    );
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
     * - robots.txt
     */
    {
      source:
        '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    },
  ],
};
