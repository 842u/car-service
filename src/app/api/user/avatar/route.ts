import type { NextRequest } from 'next/server';

import { avatarUrlChangeApiHandler } from '@/dependencies/api-handler/user';
import { userMapper } from '@/dependencies/mapper/user';
import { createAvatarUrlChangeUseCase } from '@/dependencies/use-case/user';
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
    const { message, code } = useCaseResult.error;
    return avatarUrlChangeApiHandler.errorResponse({ message }, code);
  }

  const user = useCaseResult.data;

  const userDto = userMapper.domainToDto(user);

  return avatarUrlChangeApiHandler.successResponse(userDto, 200);
}
