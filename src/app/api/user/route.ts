import type { NextRequest } from 'next/server';

import { httpErrorMapper } from '@/common/infrastructure/api-handler/http-error-mapper';
import { editUserApiHandler } from '@/user/dependency/api-handler';
import { createEditUserUseCase } from '@/user/dependency/use-case';
import { editUserApiRequestSchema } from '@/user/interface/api/edit.schema';

export const maxDuration = 10;

export async function PATCH(request: NextRequest) {
  const preprocessRequestResult = await editUserApiHandler.preprocessRequest(
    request,
    editUserApiRequestSchema,
  );

  if (!preprocessRequestResult.success) {
    const { message, issues } = preprocessRequestResult.error;
    const { status } = preprocessRequestResult;
    return editUserApiHandler.errorResponse({ message, issues }, status);
  }

  const editUserUseCase = await createEditUserUseCase();

  const contract = preprocessRequestResult.data;

  const useCaseResult = await editUserUseCase.execute(contract);

  if (!useCaseResult.success) {
    const { error, status } = httpErrorMapper.toApiError(useCaseResult.error);
    return editUserApiHandler.errorResponse(error, status);
  }

  const userDto = useCaseResult.data;

  return editUserApiHandler.successResponse(userDto, 200);
}
