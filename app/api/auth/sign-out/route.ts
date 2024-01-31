import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

import { promiseWithTimeout } from '@/utils/general';
import { getActionClient } from '@/utils/supabase';

export async function GET(request: NextRequest) {
  const redirectURL = request.nextUrl.clone();
  const cookieStore = cookies();
  const { auth } = getActionClient(cookieStore);
  const {
    data: { session },
  } = await promiseWithTimeout(auth.getSession());

  if (session) {
    await promiseWithTimeout(auth.signOut());
  }

  return NextResponse.redirect(redirectURL.origin, {
    status: 302,
  });
}
