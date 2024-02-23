import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

import { getActionClient } from '@/utils/supabase';

export const maxDuration = 10;

export async function GET(request: NextRequest) {
  const redirectURL = request.nextUrl.clone();
  const cookieStore = cookies();
  const { auth } = getActionClient(cookieStore);
  const {
    data: { session },
  } = await auth.getSession();

  if (session) {
    await auth.signOut();
  }

  return NextResponse.redirect(redirectURL.origin, {
    status: 302,
  });
}
