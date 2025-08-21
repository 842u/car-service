import type { NextRequest } from 'next/server';

import {
  type ApiResponse,
  errorApiResponse,
  successApiResponse,
} from '@/common/interface/api/response.interface';
import { Password } from '@/user/domain/user/value-objects/password/password';
import {
  type PasswordChangeApiResponseData,
  type PasswordChangeApiResponseError,
} from '@/user/interface/api/password-change.schema';
import { changeUserPasswordContractValidator } from '@/user/interface/contracts/change-user-password.schema';
import { createClient } from '@/utils/supabase/server';

type PasswordChangeApiResponse = ApiResponse<
  PasswordChangeApiResponseData,
  PasswordChangeApiResponseError
>;

export const maxDuration = 10;

export async function PATCH(request: NextRequest): PasswordChangeApiResponse {
  if (request.headers.get('content-type') !== 'application/json') {
    return errorApiResponse(
      { message: "Invalid content type. Expected 'application/json'." },
      415,
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch (_) {
    return errorApiResponse({ message: 'Invalid JSON.' }, 400);
  }

  const validationResult = changeUserPasswordContractValidator.validate(body);

  if (!validationResult.success) {
    const {
      error: { message, issues },
    } = validationResult;

    return errorApiResponse({ message, issues }, 422);
  }

  const { password: passwordDto } = validationResult.data;

  const passwordResult = Password.create(passwordDto);

  if (!passwordResult.success) {
    const {
      error: { message, issues },
    } = passwordResult;

    return errorApiResponse({ message, issues }, 422);
  }

  const password = passwordResult.data;

  const { auth } = await createClient();

  const { data, error } = await auth.updateUser({
    password: password.value,
  });

  if (error) {
    return errorApiResponse({ message: error.message }, 401);
  }

  return successApiResponse({ id: data.user.id }, 200);
}
