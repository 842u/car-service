import type { Route } from 'next';
import type { NextRequest } from 'next/server';

import { apiHandler } from '@/dependencies/api-handler';
import { createSignInWithOAuthUseCase } from '@/user/dependency/use-case';

export const maxDuration = 10;

export async function GET(request: NextRequest) {
  const requestUrl = request.nextUrl.clone();
  const { searchParams } = requestUrl;

  const next = searchParams.get('next') ?? ('/dashboard' satisfies Route);
  searchParams.delete('next');
  requestUrl.pathname = next;

  const code = searchParams.get('code');
  searchParams.delete('code');

  if (!code)
    return apiHandler.errorResponse(
      { message: 'Cannot retrieve auth code.' },
      500,
    );

  const signInWithOAuthUseCase = await createSignInWithOAuthUseCase();

  const useCaseResult = await signInWithOAuthUseCase.execute({
    code,
  });

  if (!useCaseResult.success) {
    const { message, code } = useCaseResult.error;
    return apiHandler.errorResponse({ message }, code);
  }

  return apiHandler.redirectResponse(requestUrl, 307);
}
