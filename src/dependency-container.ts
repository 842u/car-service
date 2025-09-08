/* eslint @typescript-eslint/no-explicit-any:0 */

import { createBrowserClient, createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

import { NextAuthApiClient } from '@/common/infrastructure/api/next-auth-api-client';
import { SupabaseAuthClient } from '@/common/infrastructure/auth/supabase-auth-client';
import { SupabaseDatabaseClient } from '@/common/infrastructure/database/supabase-database-client';
import { FetchClient } from '@/common/infrastructure/http/fetch-client';
import type { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

class DependencyToken<_T> {
  constructor(public readonly name: symbol) {}
}

class DependencyContainer {
  private instances = new Map<DependencyToken<any>, any>();
  private factories = new Map<
    DependencyToken<any>,
    (container: DependencyContainer) => any
  >();

  registerFactory<T>(
    token: DependencyToken<T>,
    factory: (container: DependencyContainer) => T | Promise<T>,
  ): void {
    this.factories.set(token, factory);
  }

  registerCached<T>(
    token: DependencyToken<T>,
    factory: (container: DependencyContainer) => T | Promise<T>,
  ): void {
    this.factories.set(token, async (container) => {
      if (!this.instances.has(token)) {
        const instance = await factory(container);
        this.instances.set(token, instance);
      }

      return this.instances.get(token);
    });
  }

  async resolve<T>(token: DependencyToken<T>): Promise<T> {
    if (this.instances.has(token)) {
      return this.instances.get(token);
    }

    const factory = this.factories.get(token);

    if (!factory) {
      throw new Error(`Dependency not found: ${String(token.name)}.`);
    }

    return await factory(this);
  }
}

export const dependencyContainer = new DependencyContainer();

export const dependencyTokens = {
  SUPABASE_SERVER_CLIENT: new DependencyToken<SupabaseClient<Database>>(
    Symbol('SUPABASE_SERVER_CLIENT'),
  ),
  SUPABASE_BROWSER_CLIENT: new DependencyToken<SupabaseClient<Database>>(
    Symbol('SUPABASE_BROWSER_CLIENT'),
  ),
  DATABASE_SERVER_CLIENT: new DependencyToken<SupabaseDatabaseClient>(
    Symbol('DATABASE_SERVER_CLIENT'),
  ),
  DATABASE_BROWSER_CLIENT: new DependencyToken<SupabaseDatabaseClient>(
    Symbol('DATABASE_BROWSER_CLIENT'),
  ),
  AUTH_SERVER_CLIENT: new DependencyToken<SupabaseAuthClient>(
    Symbol('AUTH_SERVER_CLIENT'),
  ),
  AUTH_BROWSER_CLIENT: new DependencyToken<SupabaseAuthClient>(
    Symbol('AUTH_BROWSER_CLIENT'),
  ),
  HTTP_CLIENT: new DependencyToken<FetchClient>(Symbol('HTTP_CLIENT')),
  AUTH_API_CLIENT: new DependencyToken<NextAuthApiClient>(
    Symbol('AUTH_API_CLIENT'),
  ),
} as const;

dependencyContainer.registerCached(
  dependencyTokens.HTTP_CLIENT,
  () => new FetchClient(),
);

dependencyContainer.registerCached(
  dependencyTokens.AUTH_API_CLIENT,
  async () => {
    const fetchClient = await dependencyContainer.resolve<FetchClient>(
      dependencyTokens.HTTP_CLIENT,
    );

    return new NextAuthApiClient(fetchClient);
  },
);

dependencyContainer.registerFactory(
  dependencyTokens.SUPABASE_SERVER_CLIENT,
  async () => {
    /**
     * *  Dynamic import to avoid loading next/headers in browser when using classic module import
     */
    const { cookies } = await import('next/headers');
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
    return client;
  },
);

dependencyContainer.registerFactory(
  dependencyTokens.SUPABASE_BROWSER_CLIENT,
  () => {
    const client = createBrowserClient<Database>(supabaseUrl, supabaseKey);
    return client;
  },
);

dependencyContainer.registerFactory(
  dependencyTokens.AUTH_SERVER_CLIENT,
  async () => {
    const supabaseServerClient = await dependencyContainer.resolve(
      dependencyTokens.SUPABASE_SERVER_CLIENT,
    );

    return new SupabaseAuthClient(supabaseServerClient);
  },
);

dependencyContainer.registerFactory(
  dependencyTokens.AUTH_BROWSER_CLIENT,
  async () => {
    const supabaseBrowserClient = await dependencyContainer.resolve(
      dependencyTokens.SUPABASE_BROWSER_CLIENT,
    );

    return new SupabaseAuthClient(supabaseBrowserClient);
  },
);

dependencyContainer.registerFactory(
  dependencyTokens.DATABASE_SERVER_CLIENT,
  async () => {
    const supabaseServerClient = await dependencyContainer.resolve(
      dependencyTokens.SUPABASE_SERVER_CLIENT,
    );

    return new SupabaseDatabaseClient(supabaseServerClient);
  },
);

dependencyContainer.registerFactory(
  dependencyTokens.DATABASE_BROWSER_CLIENT,
  async () => {
    const supabaseBrowserClient = await dependencyContainer.resolve(
      dependencyTokens.SUPABASE_BROWSER_CLIENT,
    );

    return new SupabaseDatabaseClient(supabaseBrowserClient);
  },
);
