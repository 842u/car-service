/* eslint @typescript-eslint/no-explicit-any:0 */

import { NextAuthApiService } from '@/common/infrastructure/api/next-auth-api-service';
import { SupabaseDatabaseClient } from '@/common/infrastructure/database/supabase-database-client';
import { FetchClient } from '@/common/infrastructure/http/fetch-client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

class DependencyToken<_T> {
  constructor(public readonly name: symbol) {}
}

class DependencyContainer {
  private singletons = new Map<DependencyToken<any>, any>();
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
      if (!this.singletons.has(token)) {
        const instance = await factory(container);
        this.singletons.set(token, instance);
      }

      return this.singletons.get(token);
    });
  }

  async resolve<T>(token: DependencyToken<T>): Promise<T> {
    if (this.singletons.has(token)) {
      return this.singletons.get(token);
    }

    const factory = this.factories.get(token);

    if (!factory) {
      throw new Error(`Dependency not found: ${String(token.name)}.`);
    }

    return await factory(this);
  }
}

export const dependencyContainer = new DependencyContainer();

export const DependencyTokens = {
  DATABASE_SERVER_CLIENT: new DependencyToken<SupabaseDatabaseClient>(
    Symbol('DATABASE_SERVER_CLIENT'),
  ),
  DATABASE_BROWSER_CLIENT: new DependencyToken<SupabaseDatabaseClient>(
    Symbol('DATABASE_BROWSER_CLIENT'),
  ),
  HTTP_CLIENT: new DependencyToken<FetchClient>(Symbol('HTTP_CLIENT')),
  AUTH_API_SERVICE: new DependencyToken<NextAuthApiService>(
    Symbol('AUTH_API_SERVICE'),
  ),
} as const;

dependencyContainer.registerCached(
  DependencyTokens.HTTP_CLIENT,
  () => new FetchClient(),
);

dependencyContainer.registerCached(
  DependencyTokens.AUTH_API_SERVICE,
  async () => {
    const fetchClient = await dependencyContainer.resolve<FetchClient>(
      DependencyTokens.HTTP_CLIENT,
    );

    return new NextAuthApiService(fetchClient);
  },
);

dependencyContainer.registerCached(
  DependencyTokens.DATABASE_SERVER_CLIENT,
  async () => {
    const result = await SupabaseDatabaseClient.create({
      type: 'server',
      supabaseKey,
      supabaseUrl,
    });

    if (!result.success)
      throw new Error('Failed to create database server client.');

    return result.data;
  },
);

dependencyContainer.registerCached(
  DependencyTokens.DATABASE_BROWSER_CLIENT,
  async () => {
    const result = await SupabaseDatabaseClient.create({
      type: 'browser',
      supabaseKey,
      supabaseUrl,
    });

    if (!result.success)
      throw new Error('Failed to create database browser client.');

    return result.data;
  },
);
