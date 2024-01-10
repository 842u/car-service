import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { emailSchema, passwordSchema } from '@/utils/validation';

export async function POST(requset: NextRequest) {
  const cookieStore = cookies();

  const { email, password } = await requset.json();

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
    emailSchema.parse(email);
    passwordSchema.parse(password);
  } catch (error) {
    return NextResponse.json(
      { error: 'Server validation failed. Try again.' },
      { status: 400 },
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(
    {
      message: 'Succesfully created an account.',
    },
    { status: 200 },
  );
}
