import type { FailureResult, SuccessResult } from '../../application/result';

type ApiResponseMeta = { status: number };

export type ApiResponseError<U extends object = object> = {
  message: string;
} & U;

type ApiResponseFailureResult<E extends ApiResponseError> = FailureResult<
  E,
  ApiResponseMeta
>;

type ApiResponseSuccessResult<T> = SuccessResult<T, ApiResponseMeta>;

export type ApiResponseBody<T, E extends ApiResponseError = ApiResponseError> =
  | ApiResponseSuccessResult<T>
  | ApiResponseFailureResult<E>;
