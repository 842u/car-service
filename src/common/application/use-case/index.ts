import type { ApplicationError } from '@/common/application/error';
import type { Result } from '@/common/application/result';

export interface UseCase<TContract, TData, TError = ApplicationError> {
  execute(contract: TContract): Promise<Result<TData, TError>>;
}
