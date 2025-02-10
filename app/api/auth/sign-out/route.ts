import { type NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/utils/supabase/server';

export const maxDuration = 10;

export async function GET(request: NextRequest) {
  const redirectURL = request.nextUrl.clone();

  const { auth } = await createClient();

  const {
    data: { user },
  } = await auth.getUser();

  if (!user) {
    return NextResponse.redirect(redirectURL.origin, {
      status: 401,
    });
  }

  await auth.signOut();

  return NextResponse.redirect(redirectURL.origin, {
    status: 302,
  });
}
