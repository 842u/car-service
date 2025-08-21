import { type NextRequest } from 'next/server';

import {
  type ApiResponse,
  redirectApiResponse,
} from '@/common/interface/api/response.interface';
import type {
  SignOutApiResponseData,
  SignOutApiResponseError,
} from '@/user/interface/api/sign-out.schema';
import { createClient } from '@/utils/supabase/server';

export type SignOutApiResponse = ApiResponse<
  SignOutApiResponseData,
  SignOutApiResponseError
>;

export const maxDuration = 10;

export async function GET(request: NextRequest): SignOutApiResponse {
  const redirectURL = request.nextUrl.clone();

  const { auth } = await createClient();

  await auth.signOut();

  return redirectApiResponse(redirectURL.origin, 303);
}
