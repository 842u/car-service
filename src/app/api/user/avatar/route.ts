import type { NextRequest } from 'next/server';

import { httpErrorMapper } from '@/common/infrastructure/api-handler/http-error-mapper';
import { avatarUrlChangeApiHandler } from '@/user/dependency/api-handler';
import { createAvatarUrlChangeUseCase } from '@/user/dependency/use-case';
import { avatarUrlChangeApiRequestSchema } from '@/user/interface/api/avatar-change.schema';

export const maxDuration = 10;

export async function PATCH(request: NextRequest) {
  const preprocessResult = await avatarUrlChangeApiHandler.preprocessRequest(
    request,
    avatarUrlChangeApiRequestSchema,
  );

  if (!preprocessResult.success) {
    const { message, issues } = preprocessResult.error;
    const { status } = preprocessResult;
    return avatarUrlChangeApiHandler.errorResponse({ message, issues }, status);
  }

  const avatarUrlChangeUseCase = await createAvatarUrlChangeUseCase();

  const contract = preprocessResult.data;

  const useCaseResult = await avatarUrlChangeUseCase.execute(contract);

  if (!useCaseResult.success) {
    const { error, status } = httpErrorMapper.toApiError(useCaseResult.error);
    return avatarUrlChangeApiHandler.errorResponse(error, status);
  }

  const userDto = useCaseResult.data;

  return avatarUrlChangeApiHandler.successResponse(userDto, 200);
}
