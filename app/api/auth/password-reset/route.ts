import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { RouteHandlerResponse } from '@/types';
import { promiseWithTimeout } from '@/utils/general';
import { getActionClient } from '@/utils/supabase';
import { passwordSchema } from '@/utils/validation';

export async function PATCH(request: NextRequest) {
  const { password, passwordConfirm } = await request.json();

  try {
    passwordSchema.parse(password);
    if (password !== passwordConfirm) {
      throw new Error('Passwords not match.');
    }
  } catch (error) {
    return NextResponse.json<RouteHandlerResponse>(
      { error: 'Server validation failed. Try again.', message: null },
      { status: 400 },
    );
  }

  const cookieStore = cookies();
  const { auth } = getActionClient(cookieStore);
  const { error } = await promiseWithTimeout(auth.updateUser({ password }));

  if (error) {
    return NextResponse.json<RouteHandlerResponse>(
      { error: error.message, message: null },
      { status: error.status },
    );
  }

  return NextResponse.json<RouteHandlerResponse>(
    {
      message: 'Your password has been changed.',
      error: null,
    },
    { status: 200 },
  );
}
