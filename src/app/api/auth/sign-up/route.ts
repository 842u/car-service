import { type NextRequest } from 'next/server';

import { dependencyContainer, dependencyTokens } from '@/di';
import { signUpApiRequestSchema } from '@/user/interface/api/sign-up.schema';

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const maxDuration = 10;

export async function POST(request: NextRequest) {
  const apiHandler = await dependencyContainer.resolve(
    dependencyTokens.SIGN_UP_API_HANDLER,
  );

  const preprocessRequestResult = await apiHandler.preprocessRequest(
    request,
    signUpApiRequestSchema,
  );

  if (!preprocessRequestResult.success) {
    const { message, issues } = preprocessRequestResult.error;
    const { status } = preprocessRequestResult;
    return apiHandler.errorResponse({ message, issues }, status);
  }

  const signUpUserUseCase = await dependencyContainer.resolve(
    dependencyTokens.SIGN_UP_USER_USE_CASE,
    { supabaseKey },
  );

  const useCaseResult = await signUpUserUseCase.execute(
    preprocessRequestResult.data,
  );

  if (!useCaseResult.success) {
    const { message, code } = useCaseResult.error;
    return apiHandler.errorResponse({ message }, code);
  }

  const user = useCaseResult.data;

  const userMapper = await dependencyContainer.resolve(
    dependencyTokens.USER_MAPPER,
  );

  const userDto = userMapper.domainToDto(user);

  return apiHandler.successResponse(userDto, 200);
}
