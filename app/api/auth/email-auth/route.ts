import { NextRequest, NextResponse } from 'next/server';

import { EmailAuthFormType } from '@/components/ui/EmailAuthForm/EmailAuthForm';
import { RouteHandlerResponse } from '@/types';
import { createClient } from '@/utils/supabase/server';
import { emailSchema, passwordSchema } from '@/utils/validation';

export const maxDuration = 10;

export async function POST(request: NextRequest) {
  const requestUrl = request.nextUrl.clone();
  const { searchParams } = requestUrl;
  const type = searchParams.get('type') as EmailAuthFormType | null;
  const { email, password } = await request.json();

  const { auth } = await createClient();

  if (type === 'sign-up') {
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
    } catch (_error) {
      return NextResponse.json<RouteHandlerResponse>(
        { error: 'Server validation failed. Try again.', message: null },
        { status: 400 },
      );
    }

    try {
      const { data, error } = await auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: requestUrl.origin,
        },
      });

      if (error) {
        return NextResponse.json<RouteHandlerResponse>(
          { error: error.message, message: null },
          { status: error.status },
        );
      }

      /*
       * If email confirmation and phone confirmation are enabled, signUp() will return an obfuscated user for confirmed existing user. For users who forget that have and account send email with password reset flow.
       */
      if (data?.user?.identities?.length === 0) {
        await auth.resetPasswordForEmail(email, {
          redirectTo: requestUrl.origin,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json<RouteHandlerResponse>(
          { error: error.message, message: null },
          { status: 500 },
        );
      }
    }

    return NextResponse.json<RouteHandlerResponse>(
      {
        message:
          'Welcome! To get started, please check your email and click the confirmation link.',
        error: null,
      },
      { status: 200 },
    );
  }

  if (type === 'sign-in') {
    try {
      const { error } = await auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return NextResponse.json<RouteHandlerResponse>(
          { error: error.message, message: null },
          { status: error.status },
        );
      }

      return NextResponse.json<RouteHandlerResponse>(
        {
          message: 'Successfully signed in.',
          error: null,
        },
        { status: 200 },
      );
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json<RouteHandlerResponse>(
          { error: error.message, message: null },
          { status: 500 },
        );
      }
    }
  }

  return NextResponse.json<RouteHandlerResponse>(
    { error: 'Something went wrong.', message: null },
    { status: 400 },
  );
}
