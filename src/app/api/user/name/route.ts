import type { NextRequest } from 'next/server';

import { dependencyContainer, dependencyTokens } from '@/di';

export const maxDuration = 10;

export async function PATCH(request: NextRequest) {
  const apiHandler = await dependencyContainer.resolve(
    dependencyTokens.USER_NAME_CHANGE_API_HANDLER,
  );

  const preprocessRequestResult = await apiHandler.preprocessRequest(request);

  if (!preprocessRequestResult.success) {
    const { message, issues } = preprocessRequestResult.error;
    const { status } = preprocessRequestResult;
    return apiHandler.errorResponse({ message, issues }, status);
  }

  const authClient = await dependencyContainer.resolve(
    dependencyTokens.AUTH_SERVER_CLIENT,
  );

  const sessionResult = await authClient.getSession();

  if (!sessionResult.success) {
    const { message, status } = sessionResult.error;
    return apiHandler.errorResponse({ message }, status || 401);
  }

  const { user: authIdentity } = sessionResult.data;

  const userRepository = await dependencyContainer.resolve(
    dependencyTokens.USER_REPOSITORY,
  );

  const userResult = await userRepository.getById(authIdentity.id);

  if (!userResult.success) {
    const { message } = userResult.error;
    return apiHandler.errorResponse({ message }, 400);
  }

  const user = userResult.data;

  const { name } = preprocessRequestResult.data;

  const changeNameResult = user.changeName(name);

  if (!changeNameResult.success) {
    const { message, issues } = changeNameResult.error;
    return apiHandler.errorResponse({ message, issues }, 500);
  }

  const persistenceUserChangeResult = await userRepository.changeName(user);

  if (!persistenceUserChangeResult.success) {
    const { message } = persistenceUserChangeResult.error;
    return apiHandler.errorResponse({ message }, 500);
  }

  const userMapper = await dependencyContainer.resolve(
    dependencyTokens.USER_MAPPER,
  );

  const userDto = userMapper.domainToDto(user);

  return apiHandler.successResponse(userDto, 200);
}
