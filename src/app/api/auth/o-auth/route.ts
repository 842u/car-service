import type { Route } from 'next';
import type { NextRequest } from 'next/server';

import { dependencyContainer, dependencyTokens } from '@/di';

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

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

  const code = searchParams.get('code');
  searchParams.delete('code');

  if (!code)
    return apiHandler.errorResponse(
      { message: 'Cannot retrieve auth code.' },
      500,
    );

  const signInUserWithOAuthUseCase = await dependencyContainer.resolve(
    dependencyTokens.SIGN_IN_USER_WITH_O_AUTH_USE_CASE,
    { supabaseKey },
  );

  const useCaseResult = await signInUserWithOAuthUseCase.execute({
    code,
  });

  if (!useCaseResult.success) {
    const { message, code } = useCaseResult.error;
    return apiHandler.errorResponse({ message }, code);
  }

  return apiHandler.redirectResponse(requestUrl, 307);
}
