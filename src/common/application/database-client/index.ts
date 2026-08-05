import type { Result } from '@/common/application/result';

type DatabaseError = {
  message: string;
  code?: string;
};

export type DatabaseClientResult<TData = unknown> = Result<
  TData,
  DatabaseError
>;

export interface DatabaseClient {
  query<TRow = unknown>(
    ...args: unknown[]
  ): Promise<DatabaseClientResult<TRow>>;
  rpc<TRow = unknown>(...args: unknown[]): Promise<DatabaseClientResult<TRow>>;
  mutate<TRow = unknown>(
    ...args: unknown[]
  ): Promise<DatabaseClientResult<TRow[]>>;
}
