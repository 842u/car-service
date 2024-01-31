/* eslint  @typescript-eslint/naming-convention: 0 */

import { type EmailOtpType } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { promiseWithTimeout } from '@/utils/general';
import { getActionClient } from '@/utils/supabase';

export async function GET(request: NextRequest) {
  const requestURL = request.nextUrl.clone();
  const { searchParams } = requestURL;
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/';

  requestURL.pathname = next;

  if (token_hash && type) {
    const cookieStore = cookies();
    const { auth } = getActionClient(cookieStore);
    const { error } = await promiseWithTimeout(
      auth.verifyOtp({
        type,
        token_hash,
      }),
    );

    if (error) {
      requestURL.pathname = '/auth/auth-code-error';

      return NextResponse.redirect(requestURL);
    }
  }

  return NextResponse.redirect(requestURL);
}
