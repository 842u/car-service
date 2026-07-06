import type { Route } from 'next';
import type { NextRequest } from 'next/server';

import { httpErrorMapper } from '@/common/infrastructure/api-handler/http-error-mapper';
import { apiHandler } from '@/dependency/api-handler';
import { createSignInWithOtpUseCase } from '@/user/dependency/use-case';

export const maxDuration = 10;

export async function GET(request: NextRequest) {
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

  const signInWithOtpUseCase = await createSignInWithOtpUseCase();

  const useCaseResult = await signInWithOtpUseCase.execute({
    token_hash,
    type,
  });

  if (!useCaseResult.success) {
    const { error, status } = httpErrorMapper.toApiError(useCaseResult.error);
    return apiHandler.errorResponse(error, status);
  }

  return apiHandler.redirectResponse(requestUrl, 307);
}
