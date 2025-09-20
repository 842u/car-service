import type { Result } from '@/common/application/result/result';

export type RepositoryResult = Result<unknown, unknown>;

export interface Repository<T> {
  store(model: T): Promise<RepositoryResult>;
  remove(model: T): Promise<RepositoryResult>;
}
