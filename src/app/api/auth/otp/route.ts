import type { Route } from 'next';
import type { NextRequest } from 'next/server';

import { dependencyContainer, dependencyTokens } from '@/di';

export const maxDuration = 10;

export async function GET(request: NextRequest) {
  const apiHandler = await dependencyContainer.resolve(
    dependencyTokens.API_HANDLER,
  );

  const requestUrl = request.nextUrl.clone();
  const { searchParams } = requestUrl;

  const next = searchParams.get('next') ?? ('/dashboard' satisfies Route);
  searchParams.delete('next');
  requestUrl.pathname = next;

  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  searchParams.delete('token_hash');
  searchParams.delete('type');

  if (!token_hash || !type)
    return apiHandler.errorResponse(
      { message: 'Cannot retrieve auth token or its type.' },
      500,
    );

  const signInUserWithOtpUseCase = await dependencyContainer.resolve(
    dependencyTokens.SIGN_IN_USER_WITH_OTP_USE_CASE,
  );

  const useCaseResult = await signInUserWithOtpUseCase.execute({
    token_hash,
    type,
  });

  if (!useCaseResult.success) {
    const { message, code } = useCaseResult.error;
    return apiHandler.errorResponse({ message }, code);
  }

  return apiHandler.redirectResponse(requestUrl, 307);
}
