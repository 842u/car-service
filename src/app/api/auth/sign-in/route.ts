import { type NextRequest } from 'next/server';

import type { ApiResponse } from '@/common/interface/api/response.interface';
import {
  errorApiResponse,
  successApiResponse,
} from '@/common/interface/api/response.interface';
import { dependencyContainer, dependencyTokens } from '@/dependency-container';
import type {
  SignInApiResponseData,
  SignInApiResponseError,
} from '@/user/interface/api/sign-in.schema';
import { signInContractSchema } from '@/user/interface/contracts/sign-in.schema';

export type SignInApiResponse = ApiResponse<
  SignInApiResponseData,
  SignInApiResponseError
>;

export const maxDuration = 10;

export async function POST(request: NextRequest): SignInApiResponse {
  if (request.headers.get('content-type') !== 'application/json') {
    return errorApiResponse(
      { message: "Invalid content type. Expected 'application/json'." },
      415,
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch (_) {
    return errorApiResponse({ message: 'Invalid JSON.' }, 400);
  }

  const validator = await dependencyContainer.resolveValidator({
    schema: signInContractSchema,
    errorMessage: 'Sign in contract validation failed.',
  });

  const validationResult = validator.validate(body);

  if (!validationResult.success) {
    const { message, issues } = validationResult.error;

    return errorApiResponse({ message, issues }, 400);
  }

  const { email, password } = validationResult.data;

  const authClient = await dependencyContainer.resolve(
    dependencyTokens.AUTH_SERVER_CLIENT,
  );

  const signInResult = await authClient.signIn({ email, password });

  if (!signInResult.success) {
    const { message } = signInResult.error;
    return errorApiResponse({ message }, 401);
  }

  const {
    user: { id },
  } = signInResult.data;

  return successApiResponse({ id }, 200);
}
