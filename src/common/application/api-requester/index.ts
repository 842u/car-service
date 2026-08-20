import type {
  ApiResponseBody,
  ApiResponseError,
} from '@/common/application/api-response';
import type { Result } from '@/common/application/result';

export type ApiRequesterMethod = 'POST' | 'PATCH' | 'DELETE';

export interface ApiRequester {
  send<TData>(
    method: ApiRequesterMethod,
    endpoint: string,
    contract: unknown,
    schema: { _output: ApiResponseBody<TData> },
  ): Promise<Result<TData, ApiResponseError>>;
}
