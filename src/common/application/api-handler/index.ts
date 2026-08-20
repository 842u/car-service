import type { NextURL } from 'next/dist/server/web/next-url';

import type {
  ApiResponseError,
  ApiResponseMeta,
} from '@/common/application/api-response';
import type { Result } from '@/common/application/result';

export interface ApiHandler<TData, TError extends ApiResponseError, TSchema> {
  preprocessRequest(
    request: Request,
    schema: { _output: TSchema },
    errorMessage?: string,
  ): Promise<Result<TSchema, ApiResponseError, ApiResponseMeta>>;
  errorResponse(error: TError, status: number): Response;
  successResponse(data: TData, status: number): Response;
  redirectResponse(url: string | NextURL | URL, status: number): Response;
}
