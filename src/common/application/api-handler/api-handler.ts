import type { NextURL } from 'next/dist/server/web/next-url';

import type { Result } from '@/common/application/result/result';
import type { ValidatorIssue } from '@/common/application/validator/validator';

export type ApiHandlerResponseError<U extends object = object> = {
  message: string;
} & U;

export interface ApiHandler<T, E extends ApiHandlerResponseError, S> {
  preprocessRequest(
    request: Request,
    schema: { _output: S },
    errorMessage?: string,
  ): Promise<
    Result<
      S,
      { message: string; issues?: ValidatorIssue[] },
      { status: number }
    >
  >;
  errorResponse(error: E, status: number): Response;
  successResponse(data: T, status: number): Response;
  redirectResponse(url: string | NextURL | URL, status: number): Response;
}
