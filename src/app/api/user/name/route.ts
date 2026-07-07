import type { NextRequest } from 'next/server';

import { httpErrorMapper } from '@/common/infrastructure/api-handler/http-error-mapper';
import { nameChangeApiHandler } from '@/user/dependency/api-handler';
import { createNameChangeUseCase } from '@/user/dependency/use-case';
import { nameChangeApiRequestSchema } from '@/user/interface/api/name-change.schema';

export const maxDuration = 10;

export async function PATCH(request: NextRequest) {
  const preprocessRequestResult = await nameChangeApiHandler.preprocessRequest(
    request,
    nameChangeApiRequestSchema,
  );

  if (!preprocessRequestResult.success) {
    const { message, issues } = preprocessRequestResult.error;
    const { status } = preprocessRequestResult;
    return nameChangeApiHandler.errorResponse({ message, issues }, status);
  }

  const nameChangeUseCase = await createNameChangeUseCase();

  const contract = preprocessRequestResult.data;

  const useCaseResult = await nameChangeUseCase.execute(contract);

  if (!useCaseResult.success) {
    const { error, status } = httpErrorMapper.toApiError(useCaseResult.error);
    return nameChangeApiHandler.errorResponse(error, status);
  }

  const userDto = useCaseResult.data;

  return nameChangeApiHandler.successResponse(userDto, 200);
}
