import { type NextRequest } from 'next/server';

import { signUpFormSchema } from '@/auth/credentials/application/validation/sign-up-form.schema';
import { Email } from '@/auth/credentials/domain/email';
import { Password } from '@/auth/credentials/domain/password';
import { toValidationIssue } from '@/common/application/validation/zod';
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

  const { data, error } = signUpFormSchema.safeParse(body);

  if (error) {
    const issues = error.issues.map((issue) => toValidationIssue(issue));

    return errorApiResponse(
      { message: 'Data validation failed.', issues },
      400,
    );
  }

  const emailResult = Email.create(data.email);

  if (!emailResult.success) {
    return errorApiResponse(
      { message: emailResult.error.message, issues: emailResult.error.issues },
      400,
    );
  }

  const passwordResult = Password.create(data.password);

  if (!passwordResult.success) {
    return errorApiResponse(
      {
        message: passwordResult.error.message,
        issues: passwordResult.error.issues,
      },
      400,
    );
  }

  const email = emailResult.value;
  const password = emailResult.value;
  const { auth } = await createClient();
  const requestUrl = request.nextUrl.clone();

  try {
    const { data, error } = await auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        emailRedirectTo: requestUrl.origin,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    /*
     * If email confirmation and phone confirmation are enabled, signUp() will return an obfuscated user for confirmed existing user. For users who forget that have and account send email with password reset flow.
     */
    if (data.user?.identities?.length === 0) {
      await auth.resetPasswordForEmail(email.value, {
        redirectTo: requestUrl.origin,
      });
    }

    return successApiResponse({ id: data.user?.id }, 200);
  } catch (error) {
    if (error instanceof Error) {
      return errorApiResponse({ message: error.message }, 500);
    }

    return errorApiResponse({ message: 'Unexpected error.' }, 500);
  }
}
