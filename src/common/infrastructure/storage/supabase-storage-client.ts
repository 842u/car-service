import type { FileOptions } from '@supabase/storage-js';
import type { SupabaseClient } from '@supabase/supabase-js';

import type { StorageClient } from '@/common/application/storage/storage-client.interface';
import { Result } from '@/common/interface/result/result';
import type { Database } from '@/types/supabase';

type FileBody =
  | ArrayBuffer
  | ArrayBufferView
  | Blob
  | Buffer
  | File
  | FormData
  | NodeJS.ReadableStream
  | ReadableStream<Uint8Array>
  | URLSearchParams
  | string;

export class SupabaseStorageClient implements StorageClient {
  private readonly _storageClient: SupabaseClient<Database>['storage'];

  constructor(client: SupabaseClient) {
    this._storageClient = client.storage;
  }

  async upload(
    bucketId: string,
    path: string,
    fileBody: FileBody,
    fileOptions: FileOptions,
  ) {
    try {
      const { data, error } = await this._storageClient
        .from(bucketId)
        .upload(path, fileBody, fileOptions);

      if (error) return Result.fail({ message: error.message });

      return Result.ok(data);
    } catch (error) {
      return Result.fail({
        message:
          error instanceof Error
            ? error.message
            : 'Unknown storage client error.',
      });
    }
  }
}
