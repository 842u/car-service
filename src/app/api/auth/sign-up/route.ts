import type { Route } from 'next';
import { type NextRequest } from 'next/server';

import { dependencyContainer, dependencyTokens } from '@/dependency-container';
import { Credentials } from '@/user/domain/user/value-objects/credentials';

export const maxDuration = 10;

export async function POST(request: NextRequest) {
  const apiHandler = await dependencyContainer.resolve(
    dependencyTokens.SIGN_UP_API_HANDLER,
  );

  const preprocessRequestResult = await apiHandler.preprocessRequest(request);

  if (!preprocessRequestResult.success) {
    const { message, issues } = preprocessRequestResult.error;
    const { status } = preprocessRequestResult;
    return apiHandler.errorResponse({ message, issues }, status);
  }

  const { email: emailDto, password: passwordDto } =
    preprocessRequestResult.data;

  const credentialsResult = Credentials.create(emailDto, passwordDto);

  if (!credentialsResult.success) {
    const {
      error: { message, issues },
    } = credentialsResult;

    return apiHandler.errorResponse({ message, issues }, 400);
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
    return apiHandler.errorResponse({ message }, 400);
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
      return apiHandler.errorResponse({ message }, 400);
    }
  }

  const id = user?.id || crypto.randomUUID();

  return apiHandler.successResponse({ id }, 200);
}
