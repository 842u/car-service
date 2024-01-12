import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { passwordSchema } from '@/utils/validation';

export async function PATCH(request: NextRequest) {
  const { password, passwordConfirm } = await request.json();

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

  try {
    passwordSchema.parse(password);
    if (password !== passwordConfirm) {
      throw new Error('Passwords not match.');
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Server validation failed. Try again.' },
      { status: 400 },
    );
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status },
    );
  }

  return NextResponse.json(
    {
      message: 'Your password has been changed.',
    },
    { status: 200 },
  );
}
