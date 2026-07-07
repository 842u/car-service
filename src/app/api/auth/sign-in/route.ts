import { type NextRequest } from 'next/server';

import { httpErrorMapper } from '@/common/infrastructure/api-handler/http-error-mapper';
import { signInApiHandler } from '@/user/dependency/api-handler';
import { createSignInUseCase } from '@/user/dependency/use-case';
import { signInApiRequestSchema } from '@/user/interface/api/sign-in.schema';

export const maxDuration = 10;

export async function POST(request: NextRequest) {
  const preprocessResult = await signInApiHandler.preprocessRequest(
    request,
    signInApiRequestSchema,
  );

  if (!preprocessResult.success) {
    const { message, issues } = preprocessResult.error;
    const { status } = preprocessResult;
    return signInApiHandler.errorResponse({ message, issues }, status);
  }

  const signInUseCase = await createSignInUseCase();

  const useCaseResult = await signInUseCase.execute(preprocessResult.data);

  if (!useCaseResult.success) {
    const { error, status } = httpErrorMapper.toApiError(useCaseResult.error);
    return signInApiHandler.errorResponse(error, status);
  }

  return signInApiHandler.successResponse(useCaseResult.data, 200);
}
