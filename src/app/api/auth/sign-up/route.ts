import { type NextRequest } from 'next/server';

import { signUpApiHandler } from '@/user/dependency/api-handler';
import { userMapper } from '@/user/dependency/mapper';
import { createSignUpUseCase } from '@/user/dependency/use-case';
import { signUpApiRequestSchema } from '@/user/interface/api/sign-up.schema';

export const maxDuration = 10;

export async function POST(request: NextRequest) {
  const preprocessRequestResult = await signUpApiHandler.preprocessRequest(
    request,
    signUpApiRequestSchema,
  );

  if (!preprocessRequestResult.success) {
    const { message, issues } = preprocessRequestResult.error;
    const { status } = preprocessRequestResult;
    return signUpApiHandler.errorResponse({ message, issues }, status);
  }

  const signUpUseCase = await createSignUpUseCase();

  const useCaseResult = await signUpUseCase.execute(
    preprocessRequestResult.data,
  );

  if (!useCaseResult.success) {
    const { message, code } = useCaseResult.error;
    return signUpApiHandler.errorResponse({ message }, code);
  }

  const user = useCaseResult.data;

  const userDto = userMapper.domainToDto(user);

  return signUpApiHandler.successResponse(userDto, 200);
}
