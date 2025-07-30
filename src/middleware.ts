import { createServerClient } from '@supabase/ssr';
import { Route } from 'next';
import { type NextRequest, NextResponse } from 'next/server';

import {
  baseContentSecurityPolicy,
  generateCspStringWithNonce,
} from './security/content-security-policy';
import { getRouteAccessRedirection } from './security/route-access';
import { Database } from './types/supabase';

export async function middleware(request: NextRequest) {
  const { cspString, nonce } = generateCspStringWithNonce(
    baseContentSecurityPolicy,
  );

  const requestUrl = request.nextUrl.clone();
  const responseHeaders = new Headers();

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

  const redirectTo = getRouteAccessRedirection(
    !!user,
    requestUrl.pathname as Route,
  );

  if (redirectTo) {
    return NextResponse.redirect(new URL(redirectTo, requestUrl.origin), {
      headers: responseHeaders,
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
     * - robots.txt
     */
    {
      source:
        '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    },
  ],
};
