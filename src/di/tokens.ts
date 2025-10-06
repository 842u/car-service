/* eslint @typescript-eslint/no-explicit-any:0 */

import type {
  SupabaseClient,
  User as AuthIdentity,
} from '@supabase/supabase-js';

import type { ApiHandler } from '@/common/application/api-handler/api-handler.interface';
import type {
  AuthAdminClient,
  AuthClient,
} from '@/common/application/auth-client/auth-client.interface';
import type { HttpClient } from '@/common/application/http-client/http-client.interface';
import type { IValidator } from '@/common/application/validator/validator.interface';
import type { SupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase-database-client';
import type { SupabaseStorageClient } from '@/common/infrastructure/storage/supabase-storage-client';
import type { SupabaseConfig } from '@/di/modules/supabase';
import type { Database } from '@/types/supabase';
import type { IUserApiClient } from '@/user/application/api-client/user-api-client.interface';
import type { UserMapper } from '@/user/application/mappers/user-mapper';
import type { UserRepository } from '@/user/application/repository/user-repository.interface';
import type { IUserStore } from '@/user/application/stores/user-store.interface';
import type { UserAvatarUrlChangeUseCase } from '@/user/application/use-cases/avatar-url-change';
import type { UserNameChangeUseCase } from '@/user/application/use-cases/name-change';
import type { UserPasswordChangeUseCase } from '@/user/application/use-cases/password-change';
import type { SignInUserWithOAuthUseCase } from '@/user/application/use-cases/sign-in-with-o-auth';
import type { SignInUserWithOtpUseCase } from '@/user/application/use-cases/sign-in-with-otp';
import type { SignUpUserUseCase } from '@/user/application/use-cases/sign-up-user-use-case';
import type {
  UserAvatarUrlChangeApiContract,
  UserAvatarUrlChangeApiResponseData,
  UserAvatarUrlChangeApiResponseError,
} from '@/user/interface/api/avatar-change.schema';
import type {
  UserNameChangeApiContract,
  UserNameChangeApiResponseData,
  UserNameChangeApiResponseError,
} from '@/user/interface/api/name-change.schema';
import type {
  PasswordChangeApiContract,
  PasswordChangeApiResponseData,
  PasswordChangeApiResponseError,
} from '@/user/interface/api/password-change.schema';
import type {
  SignInApiContract,
  SignInApiResponseData,
  SignInApiResponseError,
} from '@/user/interface/api/sign-in.schema';
import type {
  SignUpApiContract,
  SignUpApiResponseData,
  SignUpApiResponseError,
} from '@/user/interface/api/sign-up.schema';

export class DependencyToken<_T, _P = void> {
  constructor(public readonly name: symbol) {}
}

export const tokens = {
  /**
   * VALIDATOR
   */
  VALIDATOR: new DependencyToken<IValidator>(Symbol('VALIDATOR')),

  /**
   * HTTP CLIENT
   */
  HTTP_CLIENT: new DependencyToken<HttpClient>(Symbol('HTTP_CLIENT')),

  /**
   * API CLIENTS
   */
  USER_API_CLIENT: new DependencyToken<IUserApiClient>(
    Symbol('USER_API_CLIENT'),
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
   * AUTH CLIENTS
   */
  AUTH_CLIENT_ADMIN: new DependencyToken<
    AuthAdminClient<AuthIdentity>,
    SupabaseConfig
  >(Symbol('AUTH_CLIENT_ADMIN')),
  AUTH_CLIENT_SERVER: new DependencyToken<AuthClient<AuthIdentity>>(
    Symbol('AUTH_CLIENT_SERVER'),
  ),
  AUTH_CLIENT_BROWSER: new DependencyToken<AuthClient<AuthIdentity>>(
    Symbol('AUTH_CLIENT_BROWSER'),
  ),

  /**
   * STORAGE
   */
  STORAGE_CLIENT_ADMIN: new DependencyToken<
    SupabaseStorageClient,
    SupabaseConfig
  >(Symbol('STORAGE_CLIENT_ADMIN')),
  STORAGE_CLIENT_SERVER: new DependencyToken<SupabaseStorageClient>(
    Symbol('STORAGE_CLIENT_SERVER'),
  ),
  STORAGE_CLIENT_BROWSER: new DependencyToken<SupabaseStorageClient>(
    Symbol('STORAGE_CLIENT_BROWSER'),
  ),

  /**
   * API HANDLERS
   */
  API_HANDLER: new DependencyToken<ApiHandler<any, any, any>>(
    Symbol('API_HANDLER'),
  ),
  SIGN_UP_API_HANDLER: new DependencyToken<
    ApiHandler<SignUpApiResponseData, SignUpApiResponseError, SignUpApiContract>
  >(Symbol('SIGN_UP_API_HANDLER')),
  SIGN_IN_API_HANDLER: new DependencyToken<
    ApiHandler<SignInApiResponseData, SignInApiResponseError, SignInApiContract>
  >(Symbol('SIGN_IN_API_HANDLER')),
  PASSWORD_CHANGE_API_HANDLER: new DependencyToken<
    ApiHandler<
      PasswordChangeApiResponseData,
      PasswordChangeApiResponseError,
      PasswordChangeApiContract
    >
  >(Symbol('PASSWORD_CHANGE_API_HANDLER')),
  USER_NAME_CHANGE_API_HANDLER: new DependencyToken<
    ApiHandler<
      UserNameChangeApiResponseData,
      UserNameChangeApiResponseError,
      UserNameChangeApiContract
    >
  >(Symbol('USER_NAME_CHANGE_API_HANDLER')),
  USER_AVATAR_URL_CHANGE_API_HANDLER: new DependencyToken<
    ApiHandler<
      UserAvatarUrlChangeApiResponseData,
      UserAvatarUrlChangeApiResponseError,
      UserAvatarUrlChangeApiContract
    >
  >(Symbol('USER_AVATAR_URL_CHANGE_API_HANDLER')),

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
  USER_NAME_CHANGE_USE_CASE: new DependencyToken<UserNameChangeUseCase>(
    Symbol('USER_NAME_CHANGE_USE_CASE'),
  ),
  USER_PASSWORD_CHANGE_USE_CASE: new DependencyToken<UserPasswordChangeUseCase>(
    Symbol('USER_PASSWORD_CHANGE_USE_CASE'),
  ),
  USER_AVATAR_URL_CHANGE_USE_CASE:
    new DependencyToken<UserAvatarUrlChangeUseCase>(
      Symbol('USER_AVATAR_URL_CHANGE_USE_CASE'),
    ),

  /**
   * MAPPERS
   */
  USER_MAPPER: new DependencyToken<UserMapper>(Symbol('USER_MAPPER')),
} as const;
