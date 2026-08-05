import type { Result } from '@/common/application/result';

type StorageError = {
  message: string;
};

export type StorageClientResult<TData = unknown> = Result<TData, StorageError>;

export interface StorageClient {
  upload(...args: unknown[]): Promise<StorageClientResult<unknown>>;
}
