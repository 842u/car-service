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

  const userNameChangeUseCase = await dependencyContainer.resolve(
    dependencyTokens.USER_NAME_CHANGE_USE_CASE,
  );

  const contract = preprocessRequestResult.data;

  const useCaseResult = await userNameChangeUseCase.execute(contract);

  if (!useCaseResult.success) {
    const { message, code } = useCaseResult.error;
    return apiHandler.errorResponse({ message }, code);
  }

  const userMapper = await dependencyContainer.resolve(
    dependencyTokens.USER_MAPPER,
  );

  const user = useCaseResult.data;

  const userDto = userMapper.domainToDto(user);

  return apiHandler.successResponse(userDto, 200);
}
