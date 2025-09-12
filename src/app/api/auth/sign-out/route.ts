import { type NextRequest } from 'next/server';

import { dependencyContainer, dependencyTokens } from '@/dependency-container';

export const maxDuration = 10;

export async function GET(request: NextRequest) {
  const apiHandler = await dependencyContainer.resolve(
    dependencyTokens.API_HANDLER,
  );

  const redirectURL = request.nextUrl.clone();

  const authClient = await dependencyContainer.resolve(
    dependencyTokens.AUTH_SERVER_CLIENT,
  );

  const signOutResult = await authClient.signOut();

  if (!signOutResult.success) {
    const {
      error: { message },
    } = signOutResult;
    return apiHandler.errorResponse({ message }, 500);
  }

  return apiHandler.redirectResponse(redirectURL.origin, 303);
}
