import type { ApiResponseBody } from '@/common/application/api-response';
import type { Result } from '@/common/application/result';
import type { ValidatorIssue } from '@/common/application/validator';

export type ApiRequesterMethod = 'POST' | 'PATCH' | 'DELETE';

export type ApiRequesterError = {
  message: string;
  issues?: ValidatorIssue[];
};

export interface ApiRequester {
  send<TData>(
    method: ApiRequesterMethod,
    endpoint: string,
    contract: unknown,
    schema: { _output: ApiResponseBody<TData> },
  ): Promise<Result<TData, ApiRequesterError>>;
}
