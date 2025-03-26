import { NextRequest, NextResponse } from 'next/server';

import { EmailAuthFormType } from '@/components/ui/EmailAuthForm/EmailAuthForm';
import { RouteHandlerResponse } from '@/types';
import { createClient } from '@/utils/supabase/server';
import {
  EmailAuthFormValues,
  signUpEmailAuthFormSchema,
} from '@/utils/validation';

import { apiCarPostResponse } from '../../car/route';

export const maxDuration = 10;

type apiAuthEmailAuthPostResponse = { id: string };

export async function POST(request: NextRequest) {
  const requestUrl = request.nextUrl.clone();
  const { searchParams } = requestUrl;
  const type = searchParams.get('type') as EmailAuthFormType;
  const requestData = (await request.json()) as EmailAuthFormValues;

  const { auth } = await createClient();

  if (type === 'sign-up') {
    try {
      signUpEmailAuthFormSchema.parse(requestData);
    } catch (_error) {
      return NextResponse.json<RouteHandlerResponse>(
        {
          error: { message: 'Server validation failed. Try again.' },
          data: null,
        },
        { status: 400 },
      );
    }

    try {
      const { data, error } = await auth.signUp({
        email: requestData.email,
        password: requestData.password,
        options: {
          emailRedirectTo: requestUrl.origin,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      /*
       * If email confirmation and phone confirmation are enabled, signUp() will return an obfuscated user for confirmed existing user. For users who forget that have and account send email with password reset flow.
       */
      if (data.user?.identities?.length === 0) {
        await auth.resetPasswordForEmail(requestData.email, {
          redirectTo: requestUrl.origin,
        });
      }

      return NextResponse.json<
        RouteHandlerResponse<apiAuthEmailAuthPostResponse>
      >({ data: { id: data.user?.id || '' }, error: null }, { status: 200 });
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json<RouteHandlerResponse>(
          { error: { message: error.message }, data: null },
          { status: 500 },
        );
      }
    }
  }

  if (type === 'sign-in') {
    try {
      const { data, error } = await auth.signInWithPassword({
        email: requestData.email,
        password: requestData.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      return NextResponse.json<RouteHandlerResponse<apiCarPostResponse>>(
        { data: { id: data.user.id }, error: null },
        { status: 200 },
      );
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json<RouteHandlerResponse>(
          { error: { message: error.message }, data: null },
          { status: 500 },
        );
      }
    }
  }

  return NextResponse.json<RouteHandlerResponse>(
    { error: { message: 'Something went wrong.' }, data: null },
    { status: 400 },
  );
}
