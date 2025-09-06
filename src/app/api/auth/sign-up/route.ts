import type { Route } from 'next';
import { type NextRequest } from 'next/server';

import {
  type ApiResponse,
  errorApiResponse,
  successApiResponse,
} from '@/common/interface/api/response.interface';
import { dependencyContainer, dependencyTokens } from '@/dependency-container';
import { Credentials } from '@/user/domain/user/value-objects/credentials';
import type {
  SignUpApiResponseData,
  SignUpApiResponseError,
} from '@/user/interface/api/sign-up.schema';
import { signUpContractValidator } from '@/user/interface/contracts/sign-up.schema';

export type SignUpApiResponse = ApiResponse<
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

  const validationResult = signUpContractValidator.validate(body);

  if (!validationResult.success) {
    const {
      error: { message, issues },
    } = validationResult;

    return errorApiResponse({ message, issues }, 400);
  }

  const { email: emailDto, password: passwordDto } = validationResult.data;

  const credentialsResult = Credentials.create(emailDto, passwordDto);

  if (!credentialsResult.success) {
    const {
      error: { message, issues },
    } = credentialsResult;

    return errorApiResponse({ message, issues }, 400);
  }

  const {
    email: { value: email },
    password: { value: password },
  } = credentialsResult.data;

  const authClient = await dependencyContainer.resolve(
    dependencyTokens.AUTH_SERVER_CLIENT,
  );

  const successRedirectPath = '/dashboard' satisfies Route;

  const signUpResult = await authClient.signUp(
    { email, password },
    { emailRedirectTo: successRedirectPath },
  );

  if (!signUpResult.success) {
    const { message } = signUpResult.error;
    return errorApiResponse({ message }, 400);
  }

  const { user } = signUpResult.data;

  if (!user?.identities?.length) {
    /*
     * If email confirmation and phone confirmation are enabled, signUp() will return an obfuscated user for confirmed existing user. For users who forget that have and account send email with password reset flow.
     */
    const resetPasswordResult = await authClient.resetPassword({
      email,
      options: {
        redirectTo: successRedirectPath,
      },
    });

    if (!resetPasswordResult.success) {
      const { message } = resetPasswordResult.error;
      return errorApiResponse({ message }, 400);
    }
  }

  return successApiResponse({ id: user?.id || '' }, 200);
}
