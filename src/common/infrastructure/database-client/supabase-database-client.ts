import type {
  PostgrestResponse,
  PostgrestSingleResponse,
} from '@supabase/postgrest-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from 'supabase/types/supabase';

import type {
  DatabaseClient,
  DatabaseClientResult,
} from '@/common/application/database-client/database-client.interface';
import { Result } from '@/common/application/result/result';

export class SupabaseDatabaseClient implements DatabaseClient {
  private readonly _client: SupabaseClient<Database>;

  constructor(client: SupabaseClient) {
    this._client = client;
  }

  async query<T>(
    queryCallback: (
      nativeQuery: typeof this._client.from,
    ) => Promise<PostgrestResponse<T>>,
  ): Promise<DatabaseClientResult<T[]>>;
  async query<T>(
    queryCallback: (
      nativeQuery: typeof this._client.from,
    ) => Promise<PostgrestSingleResponse<T>>,
  ): Promise<DatabaseClientResult<T>>;
  async query<T>(
    queryCallback: (
      nativeQuery: typeof this._client.from,
    ) => Promise<PostgrestResponse<T> | PostgrestSingleResponse<T>>,
  ) {
    try {
      const { data, error } = await queryCallback(
        this._client.from.bind(this._client),
      );

      if (error) {
        return Result.fail({
          message: error.message,
          code: error.code,
        });
      }

      return Result.ok(data);
    } catch (error) {
      return Result.fail({
        message:
          error instanceof Error ? error.message : 'Unknown database error',
      });
    }
  }

  async rpc<T>(
    rpcCallback: (
      nativeRpc: typeof this._client.rpc,
    ) => Promise<PostgrestResponse<T>>,
  ): Promise<DatabaseClientResult<T[]>>;
  async rpc<T>(
    rpcCallback: (
      nativeRpc: typeof this._client.rpc,
    ) => Promise<PostgrestSingleResponse<T>>,
  ): Promise<DatabaseClientResult<T>>;
  async rpc<T>(
    rpcCallback: (
      nativeRpc: typeof this._client.rpc,
    ) => Promise<PostgrestResponse<T> | PostgrestSingleResponse<T>>,
  ) {
    try {
      const { data, error } = await rpcCallback(
        this._client.rpc.bind(this._client),
      );

      if (error) {
        return Result.fail({
          message: error.message,
          code: error.code,
        });
      }

      return Result.ok(data);
    } catch (error) {
      return Result.fail({
        message:
          error instanceof Error ? error.message : 'Unknown database error',
      });
    }
  }
}
