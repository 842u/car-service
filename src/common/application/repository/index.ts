import type { Result } from '@/common/application/result';

type RepositoryError = {
  message: string;
};

export type RepositoryResult<TData> = Result<TData, RepositoryError>;

export interface Repository<TModel> {
  store(model: TModel): Promise<RepositoryResult<null>>;
  update(model: TModel): Promise<RepositoryResult<null>>;
  remove(model: TModel): Promise<RepositoryResult<null>>;
}
