import type {
  PostgrestResponse,
  PostgrestSingleResponse,
} from '@supabase/postgrest-js';
import { createBrowserClient, createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

import type {
  DatabaseClient,
  DatabaseClientResult,
} from '@/common/application/database/database-client.interface';
import { SupabaseAuth } from '@/common/infrastructure/database/supabase-auth';
import { Result } from '@/common/interface/result/result';
import type { Database } from '@/types/supabase';

type SupabaseDatabaseClientProps = {
  type: 'browser' | 'server';
  supabaseUrl: string;
  supabaseKey: string;
};

export class SupabaseDatabaseClient implements DatabaseClient {
  private readonly _client: SupabaseClient<Database>;
  private readonly _auth: SupabaseAuth;

  private constructor(client: SupabaseClient) {
    this._client = client;
    this._auth = new SupabaseAuth(client);
  }

  static async create({
    type,
    supabaseUrl,
    supabaseKey,
  }: SupabaseDatabaseClientProps) {
    switch (type) {
      case 'browser': {
        const client = createBrowserClient<Database>(supabaseUrl, supabaseKey);
        return Result.ok(new SupabaseDatabaseClient(client));
      }

      case 'server': {
        const cookieStore = await cookies();
        const client = createServerClient<Database>(supabaseUrl, supabaseKey, {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
              try {
                cookiesToSet.forEach(({ name, value, options }) =>
                  cookieStore.set(name, value, options),
                );
              } catch {
                // The `setAll` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
              }
            },
          },
        });
        return Result.ok(new SupabaseDatabaseClient(client));
      }

      default:
        return Result.fail({
          message: 'Error creating SupabaseDatabaseClient instance.',
        });
    }
  }

  get auth() {
    return this._auth;
  }

  async transaction<T>(
    transactionCallback: (
      nativeTransaction: typeof this._client.from,
    ) => Promise<PostgrestResponse<T>>,
  ): Promise<DatabaseClientResult<T[]>>;
  async transaction<T>(
    transactionCallback: (
      nativeTransaction: typeof this._client.from,
    ) => Promise<PostgrestSingleResponse<T>>,
  ): Promise<DatabaseClientResult<T>>;
  async transaction<T>(
    transactionCallback: (
      nativeTransaction: typeof this._client.from,
    ) => Promise<PostgrestResponse<T> | PostgrestSingleResponse<T>>,
  ) {
    try {
      const { data, error } = await transactionCallback(this._client.from);

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
      const { data, error } = await rpcCallback(this._client.rpc);

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
