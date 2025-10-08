import { type NextRequest } from 'next/server';

import { signInApiHandler } from '@/dependencies/api-handler/user';
import { createServerAuthClient } from '@/dependencies/auth-client/server';
import { userMapper } from '@/dependencies/mapper/user';
import { createUserRepository } from '@/dependencies/repository';
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

  const { email, password } = preprocessResult.data;

  const authClient = await createServerAuthClient();

  const signInResult = await authClient.signIn({ email, password });

  if (!signInResult.success) {
    const { message } = signInResult.error;
    return signInApiHandler.errorResponse({ message }, 401);
  }

  const authIdentity = signInResult.data;

  const userRepository = await createUserRepository();

  const userResult = await userRepository.getById(authIdentity.id);

  if (!userResult.success) {
    return signInApiHandler.errorResponse(userResult.error, 500);
  }

  const userDto = userMapper.domainToDto(userResult.data);

  return signInApiHandler.successResponse(userDto, 200);
}
