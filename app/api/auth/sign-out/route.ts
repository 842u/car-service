import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

import { promiseWithTimeout } from '@/utils/general';

export async function GET(req: NextRequest) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    },
  );

  const {
    data: { session },
  } = await promiseWithTimeout(supabase.auth.getSession());

  if (session) {
    await promiseWithTimeout(supabase.auth.signOut());
  }

  return NextResponse.redirect(new URL('/', req.url), {
    status: 302,
  });
}
