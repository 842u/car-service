import type {
  PostgrestResponse,
  PostgrestSingleResponse,
} from '@supabase/postgrest-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from 'supabase/types/supabase';

import type {
  DatabaseClient,
  DatabaseClientResult,
} from '@/common/application/database-client';
import { Result } from '@/common/application/result';

/** Error code a mutation carries when it affected an unexpected number of rows. */
export const ROW_COUNT_MISMATCH = 'ROW_COUNT_MISMATCH';

/**
 * Minimal shape `mutate` reads from a mutation's `.select()`: the affected rows
 * and an optional error. A PostgREST filter builder satisfies it structurally,
 * so callers pass the builder directly.
 */
type MutationResponse<T> = {
  data: T[] | null;
  error: { message: string; code?: string } | null;
};

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

  /**
   * Runs a mutation (insert, update, delete) and verifies it affected exactly
   * `expectedCount` rows. The callback returns the mutation builder without a
   * terminal `.select()`; this method appends it so PostgREST returns the
   * affected rows, then fails with code `ROW_COUNT_MISMATCH` when their number
   * differs from the expectation. A zero-row write is a failure here, not the
   * fabricated success it would be through `query`.
   */
  async mutate<T>(
    mutationCallback: (nativeQuery: typeof this._client.from) => {
      select: () => PromiseLike<MutationResponse<T>>;
    },
    expectedCount: number,
  ): Promise<DatabaseClientResult<T[]>> {
    try {
      const { data, error } = await mutationCallback(
        this._client.from.bind(this._client),
      ).select();

      if (error) {
        return Result.fail({
          message: error.message,
          code: error.code,
        });
      }

      const affectedCount = data?.length ?? 0;

      if (affectedCount !== expectedCount) {
        return Result.fail({
          message: `Expected to affect ${expectedCount} row(s) but affected ${affectedCount}`,
          code: ROW_COUNT_MISMATCH,
        });
      }

      return Result.ok(data ?? []);
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
