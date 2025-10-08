import { type NextRequest } from 'next/server';

import { apiHandler } from '@/dependencies/api-handler';
import { createAuthClientServer } from '@/dependencies/auth-client/server';

export const maxDuration = 10;

export async function GET(request: NextRequest) {
  const redirectURL = request.nextUrl.clone();

  const authClient = await createAuthClientServer();

  const signOutResult = await authClient.signOut();

  if (!signOutResult.success) {
    const {
      error: { message },
    } = signOutResult;
    return apiHandler.errorResponse({ message }, 500);
  }

  return apiHandler.redirectResponse(redirectURL.origin, 303);
}
