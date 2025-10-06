import type { Result } from '@/common/application/result/result';

type RepositoryError = {
  message: string;
};

export type RepositoryResult<T> = Result<T, RepositoryError>;

export interface Repository<T> {
  store(model: T): Promise<RepositoryResult<null>>;
  remove(model: T): Promise<RepositoryResult<null>>;
}
