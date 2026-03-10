import type { Result } from '@/common/application/result';

type StorageError = {
  message: string;
};

export type StorageClientResult<T = unknown> = Result<T, StorageError>;

export interface StorageClient {
  upload(...args: unknown[]): Promise<StorageClientResult<unknown>>;
}
