import { NextRequest, NextResponse } from 'next/server';

import { RouteHandlerResponse } from '@/types';
import { createClient } from '@/utils/supabase/server';
import {
  passwordChangeFormSchema,
  PasswordChangeFormValues,
} from '@/utils/validation';

export const maxDuration = 10;

type apiAuthPasswordChangePatchResponse = { id: string };

export async function PATCH(request: NextRequest) {
  const requestData = (await request.json()) as PasswordChangeFormValues;

  try {
    passwordChangeFormSchema.parse(requestData);
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

  const { data, error } = await auth.updateUser({
    password: requestData.password,
  });

  if (error) {
    return NextResponse.json<RouteHandlerResponse>(
      { error: { message: error.message }, data: null },
      { status: error.status },
    );
  }

  return NextResponse.json<
    RouteHandlerResponse<apiAuthPasswordChangePatchResponse>
  >(
    {
      data: { id: data.user.id },
      error: null,
    },
    { status: 200 },
  );
}
