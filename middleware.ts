import { Route } from 'next';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getUserSession } from './utils/supabase';

export async function middleware(request: NextRequest) {
  const requestUrl = request.nextUrl.clone();
  const requestUrlPath = requestUrl.pathname as Route;

  const session = await getUserSession(request);

  if (!session?.user) {
    if (
      requestUrlPath !== '/' &&
      requestUrlPath !== '/dashboard/sign-in' &&
      requestUrlPath !== '/dashboard/sign-up' &&
      requestUrlPath !== '/dashboard/forgot-password'
    ) {
      return NextResponse.redirect(new URL('/dashboard/sign-in', request.url));
    }
  }

  if (session?.user) {
    if (
      (!requestUrlPath.includes('/dashboard') && requestUrlPath !== '/') ||
      requestUrlPath === '/dashboard/sign-in' ||
      requestUrlPath === '/dashboard/sign-up' ||
      requestUrlPath === '/dashboard/forgot-password'
    ) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next({ request: { headers: request.headers } });
}

export const config = {
  matcher: ['/', '/dashboard', '/dashboard/:path*'],
};
