import { type EmailOtpType } from '@supabase/supabase-js';
import type { NextRequest } from 'next/server';

import {
  errorApiResponse,
  redirectApiResponse,
} from '@/common/interface/api/response.interface';
import { dependencyContainer, dependencyTokens } from '@/dependency-container';

export const maxDuration = 10;

const ON_SUCCESS_PATH = '/dashboard';

export async function GET(request: NextRequest) {
  const requestUrl = request.nextUrl.clone();
  const { searchParams } = requestUrl;
  const next = searchParams.get('next') ?? ON_SUCCESS_PATH;

  const authClient = await dependencyContainer.resolve(
    dependencyTokens.AUTH_SERVER_CLIENT,
  );

  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;

  if (token_hash && type) {
    const otpResult = await authClient.verifyOtp({ type, token_hash });

    searchParams.delete('token_hash');
    searchParams.delete('type');
    searchParams.delete('next');

    if (!otpResult.success) {
      const { message } = otpResult.error;
      return errorApiResponse({ message }, 400);
    }
  }

  const code = searchParams.get('code');

  if (code) {
    const exchangeResult = await authClient.exchangeCodeForSession(code);

    searchParams.delete('code');

    if (!exchangeResult.success) {
      const { message } = exchangeResult.error;
      return errorApiResponse({ message }, 400);
    }
  }

  requestUrl.pathname = next;

  return redirectApiResponse(requestUrl, 307);
}
