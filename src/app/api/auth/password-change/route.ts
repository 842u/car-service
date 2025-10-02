import type { NextRequest } from 'next/server';

import { dependencyContainer, dependencyTokens } from '@/di';

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

  const contract = preprocessResult.data;

  const userPasswordChangeUseCase = await dependencyContainer.resolve(
    dependencyTokens.USER_PASSWORD_CHANGE_USE_CASE,
  );

  const useCaseResult = await userPasswordChangeUseCase.execute(contract);

  if (!useCaseResult.success) {
    const { message, code } = useCaseResult.error;
    return apiHandler.errorResponse({ message }, code);
  }

  const user = useCaseResult.data;

  const userMapper = await dependencyContainer.resolve(
    dependencyTokens.USER_MAPPER,
  );

  const userDto = userMapper.domainToDto(user);

  return apiHandler.successResponse(userDto, 200);
}
