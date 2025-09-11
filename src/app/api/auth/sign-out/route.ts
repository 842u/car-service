import { type NextRequest } from 'next/server';

import {
  type ApiResponse,
  errorApiResponse,
  redirectApiResponse,
} from '@/common/interface/api/response.interface';
import { dependencyContainer, dependencyTokens } from '@/dependency-container';
import type {
  SignOutApiResponseData,
  SignOutApiResponseError,
} from '@/user/interface/api/sign-out.schema';

type SignOutApiResponse = ApiResponse<
  SignOutApiResponseData,
  SignOutApiResponseError
>;

export const maxDuration = 10;

export async function GET(request: NextRequest): SignOutApiResponse {
  const redirectURL = request.nextUrl.clone();

  const authClient = await dependencyContainer.resolve(
    dependencyTokens.AUTH_SERVER_CLIENT,
  );

  const signOutResult = await authClient.signOut();

  if (!signOutResult.success) {
    const {
      error: { message },
    } = signOutResult;
    return errorApiResponse({ message }, 500);
  }

  return redirectApiResponse(redirectURL.origin, 303);
}
