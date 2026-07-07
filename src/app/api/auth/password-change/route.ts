import type { NextRequest } from 'next/server';

import { httpErrorMapper } from '@/common/infrastructure/api-handler/http-error-mapper';
import { passwordChangeApiHandler } from '@/user/dependency/api-handler';
import { createPasswordChangeUseCase } from '@/user/dependency/use-case';
import { passwordChangeApiRequestSchema } from '@/user/interface/api/password-change.schema';

export const maxDuration = 10;

export async function PATCH(request: NextRequest) {
  const preprocessResult = await passwordChangeApiHandler.preprocessRequest(
    request,
    passwordChangeApiRequestSchema,
  );

  if (!preprocessResult.success) {
    const { message, issues } = preprocessResult.error;
    const { status } = preprocessResult;
    return passwordChangeApiHandler.errorResponse({ message, issues }, status);
  }

  const contract = preprocessResult.data;

  const passwordChangeUseCase = await createPasswordChangeUseCase();

  const useCaseResult = await passwordChangeUseCase.execute(contract);

  if (!useCaseResult.success) {
    const { error, status } = httpErrorMapper.toApiError(useCaseResult.error);
    return passwordChangeApiHandler.errorResponse(error, status);
  }

  const userDto = useCaseResult.data;

  return passwordChangeApiHandler.successResponse(userDto, 200);
}
