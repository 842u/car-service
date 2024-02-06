/* eslint  @typescript-eslint/naming-convention: 0 */

import { type EmailOtpType } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { promiseWithTimeout } from '@/utils/general';
import { getActionClient } from '@/utils/supabase';

export async function GET(request: NextRequest) {
  const redirectURL = request.nextUrl.clone();
  const { searchParams } = request.nextUrl;
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';
  const cookieStore = cookies();
  const { auth } = getActionClient(cookieStore);

  redirectURL.pathname = next;

  if (token_hash && type) {
    const { error } = await promiseWithTimeout(
      auth.verifyOtp({
        type,
        token_hash,
      }),
    );

    if (error) {
      redirectURL.pathname = '/auth/auth-code-error';

      return NextResponse.redirect(redirectURL);
    }
  }

  if (code) {
    const { error } = await auth.exchangeCodeForSession(code);

    if (error) {
      redirectURL.pathname = '/auth/auth-code-error';

      return NextResponse.redirect(redirectURL);
    }
  }

  return NextResponse.redirect(redirectURL);
}
