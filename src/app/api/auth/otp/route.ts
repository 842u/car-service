import type { Route } from 'next';
import type { NextRequest } from 'next/server';

import { applicationError } from '@/common/application/error';
import { httpErrorMapper } from '@/common/infrastructure/api-handler/http-error-mapper';
import { apiHandler } from '@/dependency/api-handler';
import { createSignInWithOtpUseCase } from '@/user/dependency/use-case';
import { signInWithOtpApiRequestSchema } from '@/user/interface/api/sign-in-with-otp.schema';

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

  const contractResult = signInWithOtpApiRequestSchema.safeParse({
    token_hash,
    type,
  });

  if (!contractResult.success) {
    const { error, status } = httpErrorMapper.toApiError(
      applicationError.validation('Cannot retrieve auth token or its type.'),
    );
    return apiHandler.errorResponse(error, status);
  }

  const signInWithOtpUseCase = await createSignInWithOtpUseCase();

  const useCaseResult = await signInWithOtpUseCase.execute(contractResult.data);

  if (!useCaseResult.success) {
    const { error, status } = httpErrorMapper.toApiError(useCaseResult.error);
    return apiHandler.errorResponse(error, status);
  }

  return apiHandler.redirectResponse(requestUrl, 307);
}
