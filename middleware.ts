import { Route } from 'next';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getAuthenticatedRedirectPath } from './utils/middleware';
import { getUserSession } from './utils/supabase';

export async function middleware(request: NextRequest) {
  const requestUrl = request.nextUrl.clone();
  const { user } = await getUserSession(request);

  const redirectPath = getAuthenticatedRedirectPath(
    user,
    requestUrl.pathname as Route,
  );

  if (redirectPath) {
    return NextResponse.redirect(new URL(redirectPath, requestUrl.origin));
  }

  return NextResponse.next({ request: { headers: request.headers } });
}

export const config = {
  matcher: ['/', '/dashboard', '/dashboard/:path*'],
};
