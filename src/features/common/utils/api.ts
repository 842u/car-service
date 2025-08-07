import { NextResponse } from 'next/server';

import type {
  ApiResponseError,
  ErrorApiResponse,
  SuccessApiResponse,
} from '../application/validation/api-response.schema';

export function errorApiResponse<E extends ApiResponseError>(
  error: E,
  status: number,
) {
  const response: ErrorApiResponse = {
    success: false,
    status,
    error,
  };

  return NextResponse.json<ErrorApiResponse>(response, { status });
}

export function successApiResponse<T>(data: T, status: number) {
  const response: SuccessApiResponse<T> = {
    success: true,
    status,
    data,
  };

  return NextResponse.json<SuccessApiResponse<T>>(response, { status });
}
