import type { Route } from 'next';
import type { NextRequest } from 'next/server';

import { applicationError } from '@/common/application/error';
import { httpErrorMapper } from '@/common/infrastructure/api-handler/http-error-mapper';
import { apiHandler } from '@/dependency/api-handler';
import { createSignInWithOAuthUseCase } from '@/user/dependency/use-case';
import { signInWithOAuthApiRequestSchema } from '@/user/interface/api/sign-in-with-o-auth.schema';

export const maxDuration = 10;

export async function GET(request: NextRequest) {
  const requestUrl = request.nextUrl.clone();
  const { searchParams } = requestUrl;

  const next = searchParams.get('next') ?? ('/dashboard' satisfies Route);
  searchParams.delete('next');
  requestUrl.pathname = next;

  const code = searchParams.get('code');
  searchParams.delete('code');

  const contractResult = signInWithOAuthApiRequestSchema.safeParse({ code });

  if (!contractResult.success) {
    const { error, status } = httpErrorMapper.toApiError(
      applicationError.validation('Cannot retrieve auth code.'),
    );
    return apiHandler.errorResponse(error, status);
  }

  const signInWithOAuthUseCase = await createSignInWithOAuthUseCase();

  const useCaseResult = await signInWithOAuthUseCase.execute(
    contractResult.data,
  );

  if (!useCaseResult.success) {
    const { error, status } = httpErrorMapper.toApiError(useCaseResult.error);
    return apiHandler.errorResponse(error, status);
  }

  return apiHandler.redirectResponse(requestUrl, 307);
}
