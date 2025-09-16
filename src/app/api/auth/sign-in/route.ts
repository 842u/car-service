import { type NextRequest } from 'next/server';

import { dependencyContainer, dependencyTokens } from '@/di';

export const maxDuration = 10;

export async function POST(request: NextRequest) {
  const apiHandler = await dependencyContainer.resolve(
    dependencyTokens.SIGN_IN_API_HANDLER,
  );

  const preprocessResult = await apiHandler.preprocessRequest(request);

  if (!preprocessResult.success) {
    const { message, issues } = preprocessResult.error;
    const { status } = preprocessResult;
    return apiHandler.errorResponse({ message, issues }, status);
  }

  const { email, password } = preprocessResult.data;

  const authClient = await dependencyContainer.resolve(
    dependencyTokens.AUTH_SERVER_CLIENT,
  );

  const signInResult = await authClient.signIn({ email, password });

  if (!signInResult.success) {
    const { message } = signInResult.error;
    return apiHandler.errorResponse({ message }, 401);
  }

  const {
    user: { id },
  } = signInResult.data;

  return apiHandler.successResponse({ id }, 200);
}
