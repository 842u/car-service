import type { NextURL } from 'next/dist/server/web/next-url';

import type { Result } from '@/common/application/result';
import type { ValidatorIssue } from '@/common/application/validator';

export type ApiHandlerResponseError<TMeta extends object = object> = {
  message: string;
} & TMeta;

export interface ApiHandler<
  TData,
  TError extends ApiHandlerResponseError,
  TSchema,
> {
  preprocessRequest(
    request: Request,
    schema: { _output: TSchema },
    errorMessage?: string,
  ): Promise<
    Result<
      TSchema,
      { message: string; issues?: ValidatorIssue[] },
      { status: number }
    >
  >;
  errorResponse(error: TError, status: number): Response;
  successResponse(data: TData, status: number): Response;
  redirectResponse(url: string | NextURL | URL, status: number): Response;
}
