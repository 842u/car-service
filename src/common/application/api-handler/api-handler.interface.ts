import type { NextURL } from 'next/dist/server/web/next-url';

import type { Result } from '@/common/application/result/result';

export type ApiHandlerResponseMeta = { status: number };

export type ApiHandlerResponseError<U extends object = object> = {
  message: string;
} & U;

export interface ApiHandler<T, E extends ApiHandlerResponseError, S> {
  preprocessRequest(
    request: Request,
    schema: { _output: S },
    errorMessage?: string,
  ): Promise<Result<S, unknown>>;
  errorResponse(error: E, status: number): Response;
  successResponse(data: T, status: number): Response;
  redirectResponse(url: string | NextURL | URL, status: number): Response;
}
