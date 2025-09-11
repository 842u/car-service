import type { NextURL } from 'next/dist/server/web/next-url';
import { NextResponse } from 'next/server';

import type {
  FailureResult,
  SuccessResult,
} from '../../application/result/result';

type ApiResponseMeta = { status: number };

export type ApiResponseError<U extends object = object> = {
  message: string;
} & U;

type ApiResponseFailureResult<E extends ApiResponseError> = FailureResult<
  E,
  ApiResponseMeta
>;

export type ApiResponseSuccessResult<T> = SuccessResult<T, ApiResponseMeta>;

export type ApiResponse<T, E extends ApiResponseError> = Promise<
  | ReturnType<typeof successApiResponse<T> | typeof redirectApiResponse>
  | ReturnType<typeof errorApiResponse<E>>
>;

export function errorApiResponse<E extends ApiResponseError>(
  error: E,
  status: number,
) {
  const responseResult: ApiResponseFailureResult<E> = {
    success: false,
    error,
    status,
  };

  return NextResponse.json(responseResult, {
    status,
  });
}

export function successApiResponse<T>(data: T, status: number) {
  const responseResult: ApiResponseSuccessResult<T> = {
    success: true,
    data,
    status,
  };

  return NextResponse.json(responseResult, { status });
}

export function redirectApiResponse(
  url: string | NextURL | URL,
  status: number,
) {
  return NextResponse.redirect(url, { status });
}
