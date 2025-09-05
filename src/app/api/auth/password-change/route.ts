import type { NextRequest } from 'next/server';

import {
  type ApiResponse,
  errorApiResponse,
  successApiResponse,
} from '@/common/interface/api/response.interface';
import { dependencyContainer, dependencyTokens } from '@/dependency-container';
import { Password } from '@/user/domain/user/value-objects/password/password';
import {
  type PasswordChangeApiResponseData,
  type PasswordChangeApiResponseError,
} from '@/user/interface/api/password-change.schema';
import { passwordChangeContractValidator } from '@/user/interface/contracts/password-change.schema';

type PasswordChangeApiResponse = ApiResponse<
  PasswordChangeApiResponseData,
  PasswordChangeApiResponseError
>;

export const maxDuration = 10;

export async function PATCH(request: NextRequest): PasswordChangeApiResponse {
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

  const validationResult = passwordChangeContractValidator.validate(body);

  if (!validationResult.success) {
    const {
      error: { message, issues },
    } = validationResult;

    return errorApiResponse({ message, issues }, 422);
  }

  const { password: passwordDto } = validationResult.data;

  const passwordResult = Password.create(passwordDto);

  if (!passwordResult.success) {
    const {
      error: { message, issues },
    } = passwordResult;

    return errorApiResponse({ message, issues }, 422);
  }

  const password = passwordResult.data.value;

  const authClient = await dependencyContainer.resolve(
    dependencyTokens.AUTH_SERVER_CLIENT,
  );

  const updateResult = await authClient.updateUser({
    attributes: { password },
  });

  if (!updateResult.success) {
    const { message } = updateResult.error;
    return errorApiResponse({ message }, 401);
  }

  const {
    user: { id },
  } = updateResult.data;

  return successApiResponse({ id }, 200);
}
