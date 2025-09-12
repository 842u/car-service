import { type EmailOtpType } from '@supabase/supabase-js';
import type { Route } from 'next';
import type { NextRequest } from 'next/server';

import { dependencyContainer, dependencyTokens } from '@/dependency-container';

export const maxDuration = 10;

export async function GET(request: NextRequest) {
  const apiHandler = await dependencyContainer.resolve(
    dependencyTokens.API_HANDLER,
  );

  const requestUrl = request.nextUrl.clone();
  const { searchParams } = requestUrl;
  const next = searchParams.get('next') ?? ('/dashboard' satisfies Route);
  searchParams.delete('next');

  const authClient = await dependencyContainer.resolve(
    dependencyTokens.AUTH_SERVER_CLIENT,
  );

  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  searchParams.delete('token_hash');
  searchParams.delete('type');

  if (token_hash && type) {
    const otpResult = await authClient.verifyOtp({ type, token_hash });

    if (!otpResult.success) {
      const { message } = otpResult.error;
      return apiHandler.errorResponse({ message }, 400);
    }
  }

  const code = searchParams.get('code');
  searchParams.delete('code');

  if (code) {
    const exchangeResult = await authClient.exchangeCodeForSession(code);

    if (!exchangeResult.success) {
      const { message } = exchangeResult.error;
      return apiHandler.errorResponse({ message }, 400);
    }
  }

  requestUrl.pathname = next;

  return apiHandler.redirectResponse(requestUrl, 307);
}
