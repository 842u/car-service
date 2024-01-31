import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { promiseWithTimeout } from '@/utils/general';
import { getActionClient } from '@/utils/supabase';

export async function POST(requset: NextRequest) {
  const { email, password } = await requset.json();
  const cookieStore = cookies();
  const { auth } = getActionClient(cookieStore);
  const { error } = await promiseWithTimeout(
    auth.signInWithPassword({
      email,
      password,
    }),
  );

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status },
    );
  }

  return NextResponse.json(
    {
      message: 'Succesfully signed in.',
    },
    { status: 200 },
  );
}
