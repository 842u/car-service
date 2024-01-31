import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { promiseWithTimeout } from '@/utils/general';
import { getActionClient } from '@/utils/supabase';
import { emailSchema, passwordSchema } from '@/utils/validation';

export async function POST(requset: NextRequest) {
  const { email, password } = await requset.json();
  const redirectUrl = requset.nextUrl.clone();
  const cookieStore = cookies();
  const { auth } = getActionClient(cookieStore);

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
    const { data, error } = await promiseWithTimeout(
      auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl.origin,
        },
      }),
    );

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    // If email confirmation and phone confirmation are enabled, signUp() will return an obfuscated user for confirmed existing user. For users who forget that have and account send email with password reset flow.
    if (data?.user?.identities?.length === 0) {
      await promiseWithTimeout(
        auth.resetPasswordForEmail(email, {
          redirectTo: redirectUrl.origin,
        }),
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json(
    {
      message:
        'Welcome! To get started, please check your email and click the confirmation link.',
    },
    { status: 200 },
  );
}
