import type { Result } from '@/common/interface/result/result';

type DatabaseError = {
  message: string;
  code?: string;
};

export type DatabaseClientResult<T = unknown> = Result<T, DatabaseError>;

export interface DatabaseClient {
  query<T = unknown>(...args: unknown[]): Promise<DatabaseClientResult<T>>;
  rpc<T = unknown>(...args: unknown[]): Promise<DatabaseClientResult<T>>;
}
