/* eslint @typescript-eslint/no-explicit-any:0 */

import type { SupabaseClient } from '@supabase/supabase-js';

import type { NextAuthApiClient } from '@/common/infrastructure/api/next-auth-api-client';
import type { NextApiHandler } from '@/common/infrastructure/api-handler/next-api-handler';
import type {
  SupabaseAuthAdminClient,
  SupabaseAuthClient,
} from '@/common/infrastructure/auth/supabase-auth-client';
import type { SupabaseDatabaseClient } from '@/common/infrastructure/database/supabase-database-client';
import type { FetchClient } from '@/common/infrastructure/http/fetch-client';
import type { SupabaseStorageClient } from '@/common/infrastructure/storage/supabase-storage-client';
import type { ZodValidator } from '@/common/infrastructure/validation/zod-validator';
import type { ValidatorConfig } from '@/di/container';
import type { SupabaseConfig } from '@/di/modules/supabase';
import type { Database } from '@/types/supabase';
import type { UserMapper } from '@/user/application/mappers/user-mapper';
import type { IUserStore } from '@/user/application/stores/user-store.interface';
import type { SignInUserWithOAuthUseCase } from '@/user/application/use-cases/sign-in-with-o-auth';
import type { SignInUserWithOtpUseCase } from '@/user/application/use-cases/sign-in-with-otp';
import type { SignUpUserUseCase } from '@/user/application/use-cases/sign-up-user-use-case';
import type { UserRepository } from '@/user/infrastructure/repositories/user-repository';
import type {
  UserNameChangeApiResponseData,
  UserNameChangeApiResponseError,
} from '@/user/interface/api/name-change.schema';
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
import type { UserNameChangeContract } from '@/user/interface/contracts/name-change.schema';
import type { PasswordChangeContract } from '@/user/interface/contracts/password-change.schema';
import type { SignInContract } from '@/user/interface/contracts/sign-in.schema';
import type { SignUpContract } from '@/user/interface/contracts/sign-up.schema';

export class DependencyToken<_T, _P = void> {
  constructor(public readonly name: symbol) {}
}

export const tokens = {
  /**
   * VALIDATOR
   */
  VALIDATOR: new DependencyToken<ZodValidator<any>, ValidatorConfig<any>>(
    Symbol('VALIDATOR'),
  ),

  /**
   * HTTP CLIENT
   */
  HTTP_CLIENT: new DependencyToken<FetchClient>(Symbol('HTTP_CLIENT')),

  /**
   * API CLIENTS
   */
  AUTH_API_CLIENT: new DependencyToken<NextAuthApiClient>(
    Symbol('AUTH_API_CLIENT'),
  ),

  /**
   * SUPABASE
   */
  SUPABASE_ADMIN_CLIENT: new DependencyToken<
    SupabaseClient<Database>,
    SupabaseConfig
  >(Symbol('SUPABASE_ADMIN_CLIENT')),
  SUPABASE_CLIENT_SERVER: new DependencyToken<SupabaseClient<Database>>(
    Symbol('SUPABASE_CLIENT_SERVER'),
  ),
  SUPABASE_CLIENT_BROWSER: new DependencyToken<SupabaseClient<Database>>(
    Symbol('SUPABASE_CLIENT_BROWSER'),
  ),

  /**
   * DATABASE
   */
  DATABASE_CLIENT_ADMIN: new DependencyToken<
    SupabaseDatabaseClient,
    SupabaseConfig
  >(Symbol('DATABASE_CLIENT_ADMIN')),
  DATABASE_CLIENT_SERVER: new DependencyToken<SupabaseDatabaseClient>(
    Symbol('DATABASE_CLIENT_SERVER'),
  ),
  DATABASE_CLIENT_BROWSER: new DependencyToken<SupabaseDatabaseClient>(
    Symbol('DATABASE_CLIENT_BROWSER'),
  ),

  /**
   * AUTH
   */
  AUTH_ADMIN_CLIENT: new DependencyToken<
    SupabaseAuthAdminClient,
    SupabaseConfig
  >(Symbol('AUTH_ADMIN_CLIENT')),
  AUTH_SERVER_CLIENT: new DependencyToken<SupabaseAuthClient, SupabaseConfig>(
    Symbol('AUTH_SERVER_CLIENT'),
  ),
  AUTH_BROWSER_CLIENT: new DependencyToken<SupabaseAuthClient, SupabaseConfig>(
    Symbol('AUTH_BROWSER_CLIENT'),
  ),

  /**
   * STORAGE
   */
  STORAGE_ADMIN_CLIENT: new DependencyToken<
    SupabaseStorageClient,
    SupabaseConfig
  >(Symbol('STORAGE_ADMIN_CLIENT')),
  STORAGE_SERVER_CLIENT: new DependencyToken<
    SupabaseStorageClient,
    SupabaseConfig
  >(Symbol('STORAGE_SERVER_CLIENT')),
  STORAGE_BROWSER_CLIENT: new DependencyToken<
    SupabaseStorageClient,
    SupabaseConfig
  >(Symbol('STORAGE_BROWSER_CLIENT')),

  /**
   * API HANDLERS
   */
  API_HANDLER: new DependencyToken<NextApiHandler<any, any, any>>(
    Symbol('API_HANDLER'),
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
  USER_NAME_CHANGE_API_HANDLER: new DependencyToken<
    NextApiHandler<
      UserNameChangeApiResponseData,
      UserNameChangeApiResponseError,
      UserNameChangeContract
    >
  >(Symbol('USER_NAME_CHANGE_API_HANDLER')),

  /**
   * REPOSITORIES
   */
  USER_REPOSITORY_ADMIN: new DependencyToken<UserRepository, SupabaseConfig>(
    Symbol('USER_REPOSITORY_ADMIN'),
  ),
  USER_REPOSITORY_SERVER: new DependencyToken<UserRepository>(
    Symbol('USER_REPOSITORY_SERVER'),
  ),

  /**
   * STORES
   */
  USER_STORE: new DependencyToken<IUserStore>(Symbol('USER_STORE')),

  /**
   * USE CASES
   */
  SIGN_UP_USER_USE_CASE: new DependencyToken<SignUpUserUseCase, SupabaseConfig>(
    Symbol('SIGN_UP_USER_USE_CASE'),
  ),
  SIGN_IN_USER_WITH_O_AUTH_USE_CASE: new DependencyToken<
    SignInUserWithOAuthUseCase,
    SupabaseConfig
  >(Symbol('SIGN_IN_USER_WITH_O_AUTH_USE_CASE')),
  SIGN_IN_USER_WITH_OTP_USE_CASE: new DependencyToken<SignInUserWithOtpUseCase>(
    Symbol('SIGN_IN_USER_WITH_OTP_USE_CASE'),
  ),

  /**
   * MAPPERS
   */
  USER_MAPPER: new DependencyToken<UserMapper>(Symbol('USER_MAPPER')),
} as const;
