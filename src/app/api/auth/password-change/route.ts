import type { NextRequest } from 'next/server';

import { dependencyContainer, dependencyTokens } from '@/di';
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

    return apiHandler.errorResponse({ message, issues }, 422);
  }

  const password = passwordResult.data.value;

  const authClient = await dependencyContainer.resolve(
    dependencyTokens.AUTH_CLIENT_SERVER,
  );

  const updateResult = await authClient.updateUser({
    attributes: { password },
  });

  if (!updateResult.success) {
    const { message } = updateResult.error;
    return apiHandler.errorResponse({ message }, 401);
  }

  const userMapper = await dependencyContainer.resolve(
    dependencyTokens.USER_MAPPER,
  );

  const { user: authIdentity } = updateResult.data;

  const userResult = userMapper.authIdentityToDomain(authIdentity);

  if (!userResult.success) {
    const { message, issues } = userResult.error;
    return apiHandler.errorResponse({ message, issues }, 500);
  }

  const user = userResult.data;

  const userDto = userMapper.domainToDto(user);

  return apiHandler.successResponse(userDto, 200);
}
