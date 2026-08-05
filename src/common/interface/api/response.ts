import type { FailureResult, SuccessResult } from '../../application/result';

type ApiResponseMeta = { status: number };

export type ApiResponseError<TMeta extends object = object> = {
  message: string;
} & TMeta;

type ApiResponseFailureResult<TError extends ApiResponseError> = FailureResult<
  TError,
  ApiResponseMeta
>;

type ApiResponseSuccessResult<TData> = SuccessResult<TData, ApiResponseMeta>;

export type ApiResponseBody<
  TData,
  TError extends ApiResponseError = ApiResponseError,
> = ApiResponseSuccessResult<TData> | ApiResponseFailureResult<TError>;
