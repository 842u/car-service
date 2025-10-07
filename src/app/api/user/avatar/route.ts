import type { NextRequest } from 'next/server';

import { dependencyContainer, dependencyTokens } from '@/di';
import { userAvatarUrlChangeApiRequestSchema } from '@/user/interface/api/avatar-change.schema';

export const maxDuration = 10;

export async function PATCH(request: NextRequest) {
  const apiHandler = await dependencyContainer.resolve(
    dependencyTokens.USER_AVATAR_URL_CHANGE_API_HANDLER,
  );

  const preprocessResult = await apiHandler.preprocessRequest(
    request,
    userAvatarUrlChangeApiRequestSchema,
  );

  if (!preprocessResult.success) {
    const { message, issues } = preprocessResult.error;
    const { status } = preprocessResult;
    return apiHandler.errorResponse({ message, issues }, status);
  }

  const userAvatarUrlChangeUseCase = await dependencyContainer.resolve(
    dependencyTokens.USER_AVATAR_URL_CHANGE_USE_CASE,
  );

  const contract = preprocessResult.data;

  const useCaseResult = await userAvatarUrlChangeUseCase.execute(contract);

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
