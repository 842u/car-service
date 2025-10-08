import type { Route } from 'next';
import type { ZodType } from 'zod';

import type { HttpClient } from '@/common/application/http-client/http-client';
import { Result } from '@/common/application/result/result';
import type { Validator } from '@/common/application/validator/validator';
import {
  type AvatarUrlChangeApiRequest,
  avatarUrlChangeApiResponseSchema,
} from '@/user/interface/api/avatar-change.schema';
import {
  type NameChangeApiRequest,
  nameChangeApiResponseSchema,
} from '@/user/interface/api/name-change.schema';
import type { PasswordChangeApiRequest } from '@/user/interface/api/password-change.schema';
import { passwordChangeApiResponseSchema } from '@/user/interface/api/password-change.schema';
import type { SignInApiRequest } from '@/user/interface/api/sign-in.schema';
import { signInApiResponseSchema } from '@/user/interface/api/sign-in.schema';
import type { SignUpApiRequest } from '@/user/interface/api/sign-up.schema';
import { signUpApiResponseSchema } from '@/user/interface/api/sign-up.schema';
import type { UserApiClient } from '@/user/presentation/api-client/user';

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { message: string } };

export class NextUserApiClient implements UserApiClient {
  private readonly _httpClient: HttpClient;
  private readonly _validator: Validator;

  constructor(httpClient: HttpClient, validator: Validator) {
    this._httpClient = httpClient;
    this._validator = validator;
  }

  private async makeRequest<T>(
    endpoint: Route,
    contract: unknown,
    schema: ZodType<ApiResponse<T>>,
    method: 'POST' | 'PATCH',
  ): Promise<Result<T, { message: string }>> {
    const data = JSON.stringify(contract);

    const httpResult =
      method === 'POST'
        ? await this._httpClient.post(endpoint, data)
        : await this._httpClient.patch(endpoint, data);

    if (!httpResult.success) {
      return Result.fail({
        message: `HTTP request failed: ${httpResult.error.message}`,
      });
    }

    const validationResult = this._validator.validate(httpResult.data, schema);

    if (!validationResult.success) {
      return Result.fail({
        message: `API response validation failed: ${validationResult.error.message}`,
      });
    }

    const apiResponse = validationResult.data;

    if (!apiResponse.success) {
      return Result.fail({ message: apiResponse.error.message });
    }

    return Result.ok(apiResponse.data);
  }

  async signUp(contract: SignUpApiRequest) {
    return this.makeRequest(
      '/api/auth/sign-up',
      contract,
      signUpApiResponseSchema,
      'POST',
    );
  }

  async signIn(contract: SignInApiRequest) {
    return this.makeRequest(
      '/api/auth/sign-in',
      contract,
      signInApiResponseSchema,
      'POST',
    );
  }

  async passwordChange(contract: PasswordChangeApiRequest) {
    return this.makeRequest(
      '/api/auth/password-change',
      contract,
      passwordChangeApiResponseSchema,
      'PATCH',
    );
  }

  async nameChange(contract: NameChangeApiRequest) {
    return this.makeRequest(
      '/api/user/name',
      contract,
      nameChangeApiResponseSchema,
      'PATCH',
    );
  }

  async avatarChange(contract: AvatarUrlChangeApiRequest) {
    return this.makeRequest(
      '/api/user/avatar',
      contract,
      avatarUrlChangeApiResponseSchema,
      'PATCH',
    );
  }
}
