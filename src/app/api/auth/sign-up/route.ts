import type { Route } from 'next';
import { type NextRequest } from 'next/server';

import { dependencyContainer, dependencyTokens } from '@/di';
import { User } from '@/user/domain/user/user';
import { Credentials } from '@/user/domain/user/value-objects/credentials';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

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

  const signUpRedirectPath = '/dashboard' satisfies Route;

  const signUpResult = await authClient.signUp(
    { email, password },
    { emailRedirectTo: signUpRedirectPath },
  );

  if (!signUpResult.success) {
    const { message } = signUpResult.error;
    return apiHandler.errorResponse({ message }, 400);
  }

  const { user } = signUpResult.data;

  if (!user) {
    return apiHandler.errorResponse({ message: 'Something went wrong.' }, 400);
  }

  if (!user.identities?.length) {
    /*
     * If email confirmation and phone confirmation are enabled, signUp() will return an obfuscated user for confirmed existing user. For users who forget that have and account send email with password reset flow.
     */
    const resetPasswordResult = await authClient.resetPassword({
      email,
      options: {
        redirectTo: signUpRedirectPath,
      },
    });

    if (!resetPasswordResult.success) {
      const { message } = resetPasswordResult.error;
      return apiHandler.errorResponse({ message }, 400);
    }
  }

  const userResult = User.create({
    id: user.id,
    email: user.email!,
    name:
      user.user_metadata?.full_name ||
      user.user_metadata?.first_name ||
      user.email ||
      user.id,
    avatarUrl: user.user_metadata?.avatar_url,
  });

  const authAdminClient = await dependencyContainer.resolve(
    dependencyTokens.AUTH_SERVER_CLIENT,
    { supabaseKey, supabaseUrl },
  );

  if (!userResult.success) {
    await authAdminClient.admin.deleteUser({
      id: user.id,
    });
    const { message, issues } = userResult.error;
    return apiHandler.errorResponse({ message, issues }, 500);
  }

  const userRepository = await dependencyContainer.resolve(
    dependencyTokens.USER_REPOSITORY,
  );

  const storeUserResult = await userRepository.store(userResult.data);

  if (!storeUserResult.success) {
    await authAdminClient.admin.deleteUser({
      id: user.id,
    });
    const { message } = storeUserResult.error;
    return apiHandler.errorResponse({ message }, 500);
  }

  const id = user?.id || crypto.randomUUID();

  return apiHandler.successResponse({ id }, 200);
}
