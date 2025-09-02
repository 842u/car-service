import type { DatabaseAuth } from '@/common/application/database/database-auth.interface';
import type { Result } from '@/common/interface/result/result';

type DatabaseError = {
  message: string;
  code?: string;
};

export type DatabaseClientResult<T = unknown> = Result<T, DatabaseError>;

export interface DatabaseClient {
  auth: DatabaseAuth;
  transaction<T = unknown>(
    ...args: unknown[]
  ): Promise<DatabaseClientResult<T>>;
  rpc<T = unknown>(...args: unknown[]): Promise<DatabaseClientResult<T>>;
}
