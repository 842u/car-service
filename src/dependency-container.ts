/* eslint @typescript-eslint/no-explicit-any:0 */

import { createBrowserClient, createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { z } from 'zod';

import { NextAuthApiClient } from '@/common/infrastructure/api/next-auth-api-client';
import { NextApiHandler } from '@/common/infrastructure/api-handler/next-api-handler';
import { SupabaseAuthClient } from '@/common/infrastructure/auth/supabase-auth-client';
import { SupabaseDatabaseClient } from '@/common/infrastructure/database/supabase-database-client';
import { FetchClient } from '@/common/infrastructure/http/fetch-client';
import { SupabaseStorageClient } from '@/common/infrastructure/storage/supabase-storage-client';
import { ZodValidator } from '@/common/infrastructure/validation/zod-validator';
import type { Database } from '@/types/supabase';
import type {
  SignUpApiResponseData,
  SignUpApiResponseError,
} from '@/user/interface/api/sign-up.schema';
import type { SignUpContract } from '@/user/interface/contracts/sign-up.schema';
import { signUpContractSchema } from '@/user/interface/contracts/sign-up.schema';

const defaultSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const defaultSupabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface SupabaseConfig {
  supabaseUrl?: string;
  supabaseKey?: string;
}

interface ZodValidatorConfig<T extends z.ZodSchema<any>> {
  schema: T;
  errorMessage?: string;
}

class DependencyToken<_T, _P = void> {
  constructor(public readonly name: symbol) {}
}

class DependencyContainer {
  private instances = new Map<DependencyToken<any>, any>();
  private factories = new Map<
    DependencyToken<any, any>,
    (container: DependencyContainer, params?: any) => any
  >();

  registerFactory<T, P = void>(
    token: DependencyToken<T, P>,
    factory: (container: DependencyContainer, params?: P) => T | Promise<T>,
  ) {
    this.factories.set(token, factory);
  }

  registerCached<T, P = void>(
    token: DependencyToken<T, P>,
    factory: (container: DependencyContainer, params?: P) => T | Promise<T>,
  ) {
    this.factories.set(token, async (container) => {
      if (!this.instances.has(token)) {
        const instance = await factory(container);
        this.instances.set(token, instance);
      }

      return this.instances.get(token);
    });
  }

  async resolve<T, P = void>(
    token: DependencyToken<T, P>,
    params?: P,
  ): Promise<T> {
    if (this.instances.has(token)) {
      return this.instances.get(token);
    }

    const factory = this.factories.get(token);

    if (!factory) {
      throw new Error(`Dependency not found: ${String(token.name)}.`);
    }

    return await factory(this, params);
  }

  async resolveValidator<TSchema extends z.ZodSchema<any>>(
    config: ZodValidatorConfig<TSchema>,
  ): Promise<ZodValidator<z.infer<TSchema>>> {
    const factory = this.factories.get(dependencyTokens.VALIDATOR);

    if (!factory) {
      throw new Error('Validator factory not registered');
    }

    return await factory(this, config);
  }
}

export const dependencyContainer = new DependencyContainer();

export const dependencyTokens = {
  SUPABASE_SERVER_CLIENT: new DependencyToken<
    SupabaseClient<Database>,
    SupabaseConfig
  >(Symbol('SUPABASE_SERVER_CLIENT')),
  SUPABASE_BROWSER_CLIENT: new DependencyToken<
    SupabaseClient<Database>,
    SupabaseConfig
  >(Symbol('SUPABASE_BROWSER_CLIENT')),
  DATABASE_SERVER_CLIENT: new DependencyToken<
    SupabaseDatabaseClient,
    SupabaseConfig
  >(Symbol('DATABASE_SERVER_CLIENT')),
  DATABASE_BROWSER_CLIENT: new DependencyToken<
    SupabaseDatabaseClient,
    SupabaseConfig
  >(Symbol('DATABASE_BROWSER_CLIENT')),
  AUTH_SERVER_CLIENT: new DependencyToken<SupabaseAuthClient, SupabaseConfig>(
    Symbol('AUTH_SERVER_CLIENT'),
  ),
  AUTH_BROWSER_CLIENT: new DependencyToken<SupabaseAuthClient, SupabaseConfig>(
    Symbol('AUTH_BROWSER_CLIENT'),
  ),
  STORAGE_BROWSER_CLIENT: new DependencyToken<
    SupabaseStorageClient,
    SupabaseConfig
  >(Symbol('STORAGE_BROWSER_CLIENT')),
  STORAGE_SERVER_CLIENT: new DependencyToken<
    SupabaseStorageClient,
    SupabaseConfig
  >(Symbol('STORAGE_SERVER_CLIENT')),
  HTTP_CLIENT: new DependencyToken<FetchClient>(Symbol('HTTP_CLIENT')),
  AUTH_API_CLIENT: new DependencyToken<NextAuthApiClient>(
    Symbol('AUTH_API_CLIENT'),
  ),
  VALIDATOR: new DependencyToken<ZodValidator<any>, ZodValidatorConfig<any>>(
    Symbol('VALIDATOR'),
  ),
  SIGN_UP_API_HANDLER: new DependencyToken<
    NextApiHandler<
      SignUpApiResponseData,
      SignUpApiResponseError,
      SignUpContract
    >
  >(Symbol('SIGN_UP_API_HANDLER')),
} as const;

dependencyContainer.registerCached(
  dependencyTokens.SIGN_UP_API_HANDLER,
  async (container) => {
    const validator = await container.resolveValidator({
      schema: signUpContractSchema,
      errorMessage: 'Sign up contract validation failed.',
    });

    return new NextApiHandler(validator);
  },
);

dependencyContainer.registerFactory(
  dependencyTokens.VALIDATOR,
  (_, config?: ZodValidatorConfig<any>) => {
    if (!config) {
      throw new Error('Validator configuration is required');
    }
    return new ZodValidator(config.schema, config.errorMessage);
  },
);

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
  async (_, config?: SupabaseConfig) => {
    const supabaseUrl = config?.supabaseUrl ?? defaultSupabaseUrl;
    const supabaseKey = config?.supabaseKey ?? defaultSupabaseKey;

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
  (_, config?: SupabaseConfig) => {
    const supabaseUrl = config?.supabaseUrl ?? defaultSupabaseUrl;
    const supabaseKey = config?.supabaseKey ?? defaultSupabaseKey;

    const client = createBrowserClient<Database>(supabaseUrl, supabaseKey);
    return client;
  },
);

dependencyContainer.registerFactory(
  dependencyTokens.AUTH_SERVER_CLIENT,
  async (container, config?: SupabaseConfig) => {
    const supabaseServerClient = await container.resolve(
      dependencyTokens.SUPABASE_SERVER_CLIENT,
      config,
    );

    return new SupabaseAuthClient(supabaseServerClient);
  },
);

dependencyContainer.registerFactory(
  dependencyTokens.AUTH_BROWSER_CLIENT,
  async (container, config?: SupabaseConfig) => {
    const supabaseBrowserClient = await container.resolve(
      dependencyTokens.SUPABASE_BROWSER_CLIENT,
      config,
    );

    return new SupabaseAuthClient(supabaseBrowserClient);
  },
);

dependencyContainer.registerFactory(
  dependencyTokens.DATABASE_SERVER_CLIENT,
  async (container, config?: SupabaseConfig) => {
    const supabaseServerClient = await container.resolve(
      dependencyTokens.SUPABASE_SERVER_CLIENT,
      config,
    );

    return new SupabaseDatabaseClient(supabaseServerClient);
  },
);

dependencyContainer.registerFactory(
  dependencyTokens.DATABASE_BROWSER_CLIENT,
  async (container, config?: SupabaseConfig) => {
    const supabaseBrowserClient = await container.resolve(
      dependencyTokens.SUPABASE_BROWSER_CLIENT,
      config,
    );

    return new SupabaseDatabaseClient(supabaseBrowserClient);
  },
);

dependencyContainer.registerFactory(
  dependencyTokens.STORAGE_SERVER_CLIENT,
  async (container, config?: SupabaseConfig) => {
    const supabaseServerClient = await container.resolve(
      dependencyTokens.SUPABASE_SERVER_CLIENT,
      config,
    );

    return new SupabaseStorageClient(supabaseServerClient);
  },
);

dependencyContainer.registerFactory(
  dependencyTokens.STORAGE_BROWSER_CLIENT,
  async (container, config?: SupabaseConfig) => {
    const supabaseBrowserClient = await container.resolve(
      dependencyTokens.SUPABASE_BROWSER_CLIENT,
      config,
    );

    return new SupabaseStorageClient(supabaseBrowserClient);
  },
);
