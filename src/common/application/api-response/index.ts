import type { FailureResult, SuccessResult } from '@/common/application/result';
import type { ValidatorIssue } from '@/common/application/validator';

export type ApiResponseMeta = { status: number };

export type ApiResponseError<TMeta extends object = object> = {
  message: string;
  issues?: ValidatorIssue[];
} & TMeta;

export type ApiResponseFailureResult<TError extends ApiResponseError> =
  FailureResult<TError, ApiResponseMeta>;

export type ApiResponseSuccessResult<TData> = SuccessResult<
  TData,
  ApiResponseMeta
>;

export type ApiResponseBody<
  TData,
  TError extends ApiResponseError = ApiResponseError,
> = ApiResponseSuccessResult<TData> | ApiResponseFailureResult<TError>;
