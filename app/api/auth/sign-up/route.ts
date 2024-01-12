import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { emailSchema, passwordSchema } from '@/utils/validation';

export async function POST(requset: NextRequest) {
  const { email, password } = await requset.json();
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

  // * only for local development due to inconsistency error messages in signUp()
  if (error?.message === 'User already registered') {
    const redirectTo = requset.nextUrl.clone();
    redirectTo.pathname = '/account/password-reset';

    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo.href,
    });

    return NextResponse.json({
      message:
        'Welcome! To get started, please check your email and click the confirmation link. USER ALREADY EXIST',
    });
  }

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status },
    );
  }

  // * switch with this in production
  // if (error) {
  //   return NextResponse.json(
  //     { error: error.message },
  //     { status: error.status },
  //   );
  // }

  // if (data?.user?.identities?.length === 0) {
  //   const redirectTo = requset.nextUrl.clone();
  //   redirectTo.pathname = '/account/reset-password';

  //   await supabase.auth.resetPasswordForEmail(email, {
  //     redirectTo: redirectTo.href,
  //   });

  //   return NextResponse.json({
  //     message:
  //       'Welcome! To get started, please check your email and click the confirmation link. USER ALREADY EXIST',
  //   });
  // }

  return NextResponse.json(
    {
      message:
        'Welcome! To get started, please check your email and click the confirmation link.',
    },
    { status: 200 },
  );
}
