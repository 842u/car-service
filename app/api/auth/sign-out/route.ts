import { type NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/utils/supabase/server';

export const maxDuration = 10;

export async function GET(request: NextRequest) {
  const redirectURL = request.nextUrl.clone();

  const { auth } = createClient();

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
