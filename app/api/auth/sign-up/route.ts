import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { emailSchema, passwordSchema } from '@/utils/validation';

export async function POST(requset: NextRequest) {
  const { email, password } = await requset.json();
  const cookieStore = cookies();
  const redirectUrl = requset.nextUrl.clone();

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

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl.origin,
      },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    if (data?.user?.identities?.length === 0) {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl.origin,
      });

      return NextResponse.json(
        {
          message:
            'Welcome! To get started, please check your email and click the confirmation link.',
        },
        {
          status: 200,
        },
      );
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json(
    {
      message:
        'Welcome! To get started, please check your email and click the confirmation link.',
    },
    { status: 200 },
  );
}
