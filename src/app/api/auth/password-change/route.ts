import type { NextRequest } from 'next/server';

import {
  errorApiResponse,
  successApiResponse,
} from '@/common/interface/api/response.interface';
import { dependencyContainer, dependencyTokens } from '@/dependency-container';
import { Password } from '@/user/domain/user/value-objects/password/password';

export const maxDuration = 10;

export async function PATCH(request: NextRequest) {
  const apiHandler = await dependencyContainer.resolve(
    dependencyTokens.PASSWORD_CHANGE_API_HANDLER,
  );

  const preprocessResult = await apiHandler.preprocessRequest(request);

  if (!preprocessResult.success) {
    const { message, issues } = preprocessResult.error;
    const { status } = preprocessResult;
    return apiHandler.errorResponse({ message, issues }, status);
  }

  const { password: passwordDto } = preprocessResult.data;

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
