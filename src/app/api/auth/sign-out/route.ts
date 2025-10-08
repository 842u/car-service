import { type NextRequest } from 'next/server';

import { apiHandler } from '@/dependency/api-handler';
import { createServerAuthClient } from '@/dependency/auth-client/server';

export const maxDuration = 10;

export async function GET(request: NextRequest) {
  const redirectURL = request.nextUrl.clone();

  const authClient = await createServerAuthClient();

  const signOutResult = await authClient.signOut();

  if (!signOutResult.success) {
    const {
      error: { message },
    } = signOutResult;
    return apiHandler.errorResponse({ message }, 500);
  }

  return apiHandler.redirectResponse(redirectURL.origin, 303);
}
