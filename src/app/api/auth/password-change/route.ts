import type { NextRequest } from 'next/server';

import { passwordChangeApiHandler } from '@/user/dependency/api-handler';
import { userMapper } from '@/user/dependency/mapper';
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
    const { message, code } = useCaseResult.error;
    return passwordChangeApiHandler.errorResponse({ message }, code);
  }

  const user = useCaseResult.data;

  const userDto = userMapper.domainToDto(user);

  return passwordChangeApiHandler.successResponse(userDto, 200);
}
