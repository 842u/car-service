import type { NextRequest } from 'next/server';

import { nameChangeApiHandler } from '@/dependencies/api-handler/user';
import { userMapper } from '@/dependencies/mapper/user';
import { createNameChangeUseCase } from '@/dependencies/use-case/user';
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
    const { message, code } = useCaseResult.error;
    return nameChangeApiHandler.errorResponse({ message }, code);
  }

  const user = useCaseResult.data;

  const userDto = userMapper.domainToDto(user);

  return nameChangeApiHandler.successResponse(userDto, 200);
}
