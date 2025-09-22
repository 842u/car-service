import type { Result } from '@/common/application/result/result';

type UseCaseError<U> = {
  message: string;
} & U;

type UseCaseResult<U> = Result<unknown, UseCaseError<U>>;

export interface UseCase<C, U extends Record<string, unknown>> {
  execute(contract?: C): Promise<UseCaseResult<U>>;
}
