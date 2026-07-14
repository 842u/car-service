import { type NextRequest } from 'next/server';

import { httpErrorMapper } from '@/common/infrastructure/api-handler/http-error-mapper';
import { getRequestOrigin } from '@/common/interface/api/request-origin';
import { signUpApiHandler } from '@/user/dependency/api-handler';
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

  const origin = getRequestOrigin(request);
  const signUpUseCase = await createSignUpUseCase(origin);

  const useCaseResult = await signUpUseCase.execute(
    preprocessRequestResult.data,
  );

  if (!useCaseResult.success) {
    const { error, status } = httpErrorMapper.toApiError(useCaseResult.error);
    return signUpApiHandler.errorResponse(error, status);
  }

  const userDto = useCaseResult.data;

  return signUpApiHandler.successResponse(userDto, 200);
}
