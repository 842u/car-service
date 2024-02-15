/* eslint  @typescript-eslint/naming-convention: 0 */

import { type EmailOtpType } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { RouteHandlerResponse } from '@/types';
import { promiseWithTimeout } from '@/utils/general';
import { getActionClient } from '@/utils/supabase';

const ON_SUCCESS_PATH = '/dashboard';

export async function GET(request: NextRequest) {
  const requestUrl = request.nextUrl.clone();
  const { searchParams } = requestUrl;
  const next = searchParams.get('next') ?? ON_SUCCESS_PATH;

  const cookieStore = cookies();
  const { auth } = getActionClient(cookieStore);

  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;

  if (token_hash && type) {
    const { error } = await promiseWithTimeout(
      auth.verifyOtp({
        type,
        token_hash,
      }),
    );

    if (error) {
      return NextResponse.json<RouteHandlerResponse>(
        { error: error.message, message: null },
        { status: error.status },
      );
    }
  }

  const code = searchParams.get('code');

  if (code) {
    const { error } = await promiseWithTimeout(
      auth.exchangeCodeForSession(code),
    );

    if (error) {
      return NextResponse.json<RouteHandlerResponse>(
        { error: error.message, message: null },
        { status: error.status },
      );
    }
  }

  requestUrl.pathname = next;

  return NextResponse.redirect(requestUrl);
}
