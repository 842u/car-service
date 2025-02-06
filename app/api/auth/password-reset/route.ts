import { NextRequest, NextResponse } from 'next/server';

import { RouteHandlerResponse } from '@/types';
import { createClient } from '@/utils/supabase/server';
import { passwordSchema } from '@/utils/validation';

export const maxDuration = 10;

export async function PATCH(request: NextRequest) {
  const { password, passwordConfirm } = await request.json();

  try {
    passwordSchema.parse(password);
    if (password !== passwordConfirm) {
      throw new Error('Passwords not match.');
    }
  } catch (_error) {
    return NextResponse.json<RouteHandlerResponse>(
      { error: 'Server validation failed. Try again.', message: null },
      { status: 400 },
    );
  }

  const { auth } = await createClient();

  const { error } = await auth.updateUser({ password });

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
