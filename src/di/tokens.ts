/* eslint @typescript-eslint/no-explicit-any:0 */

import type { SupabaseClient } from '@supabase/supabase-js';

import type { NextAuthApiClient } from '@/common/infrastructure/api/next-auth-api-client';
import type { NextApiHandler } from '@/common/infrastructure/api-handler/next-api-handler';
import type { SupabaseAuthClient } from '@/common/infrastructure/auth/supabase-auth-client';
import type { SupabaseDatabaseClient } from '@/common/infrastructure/database/supabase-database-client';
import type { FetchClient } from '@/common/infrastructure/http/fetch-client';
import type { SupabaseStorageClient } from '@/common/infrastructure/storage/supabase-storage-client';
import type { ZodValidator } from '@/common/infrastructure/validation/zod-validator';
import type { ValidatorConfig } from '@/di/container';
import type { SupabaseConfig } from '@/di/modules/supabase';
import type { Database } from '@/types/supabase';
import type { SignUpUserUseCase } from '@/user/application/use-cases/sign-up-user-use-case';
import type { UserRepository } from '@/user/infrastructure/repositories/user-repository';
import type {
  PasswordChangeApiResponseData,
  PasswordChangeApiResponseError,
} from '@/user/interface/api/password-change.schema';
import type {
  SignInApiResponseData,
  SignInApiResponseError,
} from '@/user/interface/api/sign-in.schema';
import type {
  SignUpApiResponseData,
  SignUpApiResponseError,
} from '@/user/interface/api/sign-up.schema';
import type { PasswordChangeContract } from '@/user/interface/contracts/password-change.schema';
import type { SignInContract } from '@/user/interface/contracts/sign-in.schema';
import type { SignUpContract } from '@/user/interface/contracts/sign-up.schema';

export class DependencyToken<_T, _P = void> {
  constructor(public readonly name: symbol) {}
}

export const tokens = {
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
  VALIDATOR: new DependencyToken<ZodValidator<any>, ValidatorConfig<any>>(
    Symbol('VALIDATOR'),
  ),
  SIGN_UP_API_HANDLER: new DependencyToken<
    NextApiHandler<
      SignUpApiResponseData,
      SignUpApiResponseError,
      SignUpContract
    >
  >(Symbol('SIGN_UP_API_HANDLER')),
  SIGN_IN_API_HANDLER: new DependencyToken<
    NextApiHandler<
      SignInApiResponseData,
      SignInApiResponseError,
      SignInContract
    >
  >(Symbol('SIGN_IN_API_HANDLER')),
  PASSWORD_CHANGE_API_HANDLER: new DependencyToken<
    NextApiHandler<
      PasswordChangeApiResponseData,
      PasswordChangeApiResponseError,
      PasswordChangeContract
    >
  >(Symbol('PASSWORD_CHANGE_API_HANDLER')),
  API_HANDLER: new DependencyToken<NextApiHandler<any, any, any>>(
    Symbol('API_HANDLER'),
  ),
  USER_REPOSITORY: new DependencyToken<UserRepository>(Symbol('API_HANDLER')),
  SIGN_UP_USER_USE_CASE: new DependencyToken<SignUpUserUseCase, SupabaseConfig>(
    Symbol('SIGN_UP_USER_USE_CASE'),
  ),
} as const;
