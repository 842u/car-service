import { type CookieOptions, createServerClient } from '@supabase/ssr';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (
      request.nextUrl.pathname !== '/' &&
      request.nextUrl.pathname !== '/dashboard/sign-in' &&
      request.nextUrl.pathname !== '/dashboard/sign-up'
    ) {
      return NextResponse.redirect(new URL('/dashboard/sign-in', request.url));
    }
  }

  if (user) {
    if (
      (!request.nextUrl.pathname.includes('/dashboard') &&
        request.nextUrl.pathname !== '/') ||
      request.nextUrl.pathname === '/dashboard/sign-in' ||
      request.nextUrl.pathname === '/dashboard/sign-up'
    ) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/', '/dashboard', '/dashboard/:path*'],
};
