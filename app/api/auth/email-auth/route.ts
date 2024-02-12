import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { EmailAuthFormType } from '@/components/ui/EmailAuthForm/EmailAuthForm';
import { promiseWithTimeout } from '@/utils/general';
import { getActionClient } from '@/utils/supabase';
import { emailSchema, passwordSchema } from '@/utils/validation';

export async function POST(request: NextRequest) {
  const requestUrl = request.nextUrl.clone();
  const { searchParams } = requestUrl;
  const type = searchParams.get('type') as EmailAuthFormType | null;
  const { email, password } = await request.json();
  const cookieStore = cookies();
  const { auth } = getActionClient(cookieStore);

  if (type === 'sign-up') {
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
            emailRedirectTo: requestUrl.origin,
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
            redirectTo: requestUrl.origin,
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

  if (type === 'sign-in') {
    try {
      const { error } = await promiseWithTimeout(
        auth.signInWithPassword({
          email,
          password,
        }),
      );

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: error.status },
        );
      }

      return NextResponse.json(
        {
          message: 'Succesfully signed in.',
        },
        { status: 200 },
      );
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ error: 'Something went wrong.' }, { status: 400 });
}
