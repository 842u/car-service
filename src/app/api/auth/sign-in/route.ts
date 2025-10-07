import { type NextRequest } from 'next/server';

import { dependencyContainer, dependencyTokens } from '@/di';
import { signInApiRequestSchema } from '@/user/interface/api/sign-in.schema';

export const maxDuration = 10;

export async function POST(request: NextRequest) {
  const apiHandler = await dependencyContainer.resolve(
    dependencyTokens.SIGN_IN_API_HANDLER,
  );

  const preprocessResult = await apiHandler.preprocessRequest(
    request,
    signInApiRequestSchema,
  );

  if (!preprocessResult.success) {
    const { message, issues } = preprocessResult.error;
    const { status } = preprocessResult;
    return apiHandler.errorResponse({ message, issues }, status);
  }

  const { email, password } = preprocessResult.data;

  const authClient = await dependencyContainer.resolve(
    dependencyTokens.AUTH_CLIENT_SERVER,
  );

  const signInResult = await authClient.signIn({ email, password });

  if (!signInResult.success) {
    const { message } = signInResult.error;
    return apiHandler.errorResponse({ message }, 401);
  }

  const authIdentity = signInResult.data;

  const userRepository = await dependencyContainer.resolve(
    dependencyTokens.USER_REPOSITORY_SERVER,
  );

  const userResult = await userRepository.getById(authIdentity.id);

  if (!userResult.success) {
    return apiHandler.errorResponse(userResult.error, 500);
  }

  const userMapper = await dependencyContainer.resolve(
    dependencyTokens.USER_MAPPER,
  );

  const userDto = userMapper.domainToDto(userResult.data);

  return apiHandler.successResponse(userDto, 200);
}
