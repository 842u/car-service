import { NextRequest, NextResponse } from 'next/server';

import { RouteHandlerResponse } from '@/types';
import { createClient } from '@/utils/supabase/server';
import { passwordSchema } from '@/utils/validation';

export const maxDuration = 10;

type apiAuthPasswordResetPatchResponse = { id: string };

export async function PATCH(request: NextRequest) {
  const { password, passwordConfirm } = await request.json();

  try {
    passwordSchema.parse(password);
    if (password !== passwordConfirm) {
      throw new Error('Passwords not match.');
    }
  } catch (_error) {
    return NextResponse.json<RouteHandlerResponse>(
      {
        error: { message: 'Server validation failed. Try again.' },
        data: null,
      },
      { status: 400 },
    );
  }

  const { auth } = await createClient();

  const { data, error } = await auth.updateUser({ password });

  if (error) {
    return NextResponse.json<RouteHandlerResponse>(
      { error: { message: error.message }, data: null },
      { status: error.status },
    );
  }

  return NextResponse.json<
    RouteHandlerResponse<apiAuthPasswordResetPatchResponse>
  >(
    {
      data: { id: data.user.id },
      error: null,
    },
    { status: 200 },
  );
}
