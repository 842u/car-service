/* eslint  @typescript-eslint/naming-convention: 0 */

import { type EmailOtpType } from '@supabase/supabase-js';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { RouteHandlerResponse } from '@/types';
import { createClient } from '@/utils/supabase/server';

export const maxDuration = 10;

const ON_SUCCESS_PATH = '/dashboard';

export async function GET(request: NextRequest) {
  const requestUrl = request.nextUrl.clone();
  const { searchParams } = requestUrl;
  const next = searchParams.get('next') ?? ON_SUCCESS_PATH;

  const { auth } = await createClient();

  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;

  if (token_hash && type) {
    const { error } = await auth.verifyOtp({ type, token_hash });

    searchParams.delete('token_hash');
    searchParams.delete('type');
    searchParams.delete('next');

    if (error) {
      return NextResponse.json<RouteHandlerResponse>(
        { error: { message: error.message }, data: null },
        { status: error.status },
      );
    }
  }

  const code = searchParams.get('code');

  if (code) {
    const { error } = await auth.exchangeCodeForSession(code);

    searchParams.delete('code');

    if (error) {
      return NextResponse.json<RouteHandlerResponse>(
        { error: { message: error.message }, data: null },
        { status: error.status },
      );
    }
  }

  requestUrl.pathname = next;

  return NextResponse.redirect(requestUrl);
}
