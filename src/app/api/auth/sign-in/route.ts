import { type NextRequest } from 'next/server';

import type { SignInApiResponseData } from '@/auth/credentials/application/validation/api/sign-in.schema';
import { validateSignInFormData } from '@/auth/credentials/application/validation/sign-in-form.schema';
import { errorApiResponse, successApiResponse } from '@/common/utils/api';
import { createClient } from '@/utils/supabase/server';

export const maxDuration = 10;

export async function POST(request: NextRequest) {
  if (request.headers.get('content-type') !== 'application/json') {
    return errorApiResponse(
      { message: "Invalid content type. Expected 'application/json'." },
      415,
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch (_) {
    return errorApiResponse({ message: 'Invalid JSON.' }, 400);
  }

  const validationResult = validateSignInFormData(body);

  if (!validationResult.success) {
    const {
      error: { message, issues },
    } = validationResult;

    return errorApiResponse({ message, issues }, 400);
  }

  const { email, password } = validationResult.data;

  const { auth } = await createClient();

  try {
    const { data: signInData, error: signInError } =
      await auth.signInWithPassword({
        email,
        password,
      });

    if (signInError) {
      return errorApiResponse({ message: signInError.message }, 401);
    }

    return successApiResponse<SignInApiResponseData>(
      { id: signInData.user.id },
      200,
    );
  } catch (error) {
    if (error instanceof Error) {
      return errorApiResponse({ message: error.message }, 500);
    }

    return errorApiResponse({ message: 'Unexpected error.' }, 500);
  }
}
