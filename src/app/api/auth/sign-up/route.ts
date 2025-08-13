import { type NextRequest } from 'next/server';

import { Email } from '@/auth/credentials/domain/email';
import { Password } from '@/auth/credentials/domain/password';
import type {
  SignUpApiResponseData,
  SignUpApiResponseError,
} from '@/auth/credentials/interface/validation/api/sign-up.schema';
import { validateSignUpFormData } from '@/auth/credentials/interface/validation/sign-up-form.schema';
import {
  type ApiResponse,
  errorApiResponse,
  successApiResponse,
} from '@/common/interface/api/response.interface';
import { createClient } from '@/utils/supabase/server';

type SignUpApiResponse = ApiResponse<
  SignUpApiResponseData,
  SignUpApiResponseError
>;

export const maxDuration = 10;

export async function POST(request: NextRequest): SignUpApiResponse {
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

  const validationResult = validateSignUpFormData(body);

  if (!validationResult.success) {
    const {
      error: { message, issues },
    } = validationResult;

    return errorApiResponse({ message, issues }, 400);
  }

  const { email: requestEmail, password: requestPassword } =
    validationResult.data;

  const emailResult = Email.create(requestEmail);

  if (!emailResult.success) {
    const {
      error: { message, issues },
    } = emailResult;

    return errorApiResponse({ message, issues }, 400);
  }

  const passwordResult = Password.create(requestPassword);

  if (!passwordResult.success) {
    const {
      error: { message, issues },
    } = passwordResult;

    return errorApiResponse({ message, issues }, 400);
  }

  const email = emailResult.data;
  const password = passwordResult.data;

  const requestUrl = request.nextUrl.clone();

  const { auth } = await createClient();

  try {
    const { data, error } = await auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        emailRedirectTo: requestUrl.origin,
      },
    });

    if (error) {
      return errorApiResponse({ message: error.message }, 500);
    }

    /*
     * If email confirmation and phone confirmation are enabled, signUp() will return an obfuscated user for confirmed existing user. For users who forget that have and account send email with password reset flow.
     */
    if (data.user?.identities?.length === 0) {
      const { error } = await auth.resetPasswordForEmail(email.value, {
        redirectTo: requestUrl.origin,
      });

      if (error) {
        return errorApiResponse({ message: error.message }, 500);
      }
    }

    return successApiResponse({ id: data.user?.id || '' }, 200);
  } catch (error) {
    if (error instanceof Error) {
      return errorApiResponse({ message: error.message }, 500);
    }

    return errorApiResponse({ message: 'Unexpected error.' }, 500);
  }
}
