import type { Route } from 'next';

import { Result } from '@/common/application/result/result';
import type { FetchClient } from '@/common/infrastructure/http/fetch-client';
import { dependencyContainer } from '@/di';
import type { IAuthApiClient } from '@/user/application/api/auth-api-client.interface';
import { passwordChangeApiResponseSchema } from '@/user/interface/api/password-change.schema';
import { signInApiResponseSchema } from '@/user/interface/api/sign-in.schema';
import { signUpApiResponseSchema } from '@/user/interface/api/sign-up.schema';
import type { PasswordChangeContract } from '@/user/interface/contracts/password-change.schema';
import type { SignInContract } from '@/user/interface/contracts/sign-in.schema';
import type { SignUpContract } from '@/user/interface/contracts/sign-up.schema';

export class NextAuthApiClient implements IAuthApiClient {
  private _httpClient: FetchClient;

  constructor(httpClient: FetchClient) {
    this._httpClient = httpClient;
  }

  async signUp(contract: SignUpContract) {
    const data = JSON.stringify(contract);

    const fetchResult = await this._httpClient.post(
      '/api/auth/sign-up' satisfies Route,
      data,
    );

    if (!fetchResult.success) {
      return Result.fail({ message: fetchResult.error.message });
    }

    const validator = await dependencyContainer.resolveValidator({
      schema: signUpApiResponseSchema,
      errorMessage: 'Invalid API response format.',
    });

    const validationResult = validator.validate(fetchResult.data);

    if (!validationResult.success) {
      return Result.fail({ message: validationResult.error.message });
    }

    const apiResponseResult = validationResult.data;

    if (!apiResponseResult.success) {
      return Result.fail({ message: apiResponseResult.error.message });
    }

    const userDto = apiResponseResult.data;

    return Result.ok(userDto);
  }

  async signIn(contract: SignInContract) {
    const data = JSON.stringify(contract);

    const fetchResult = await this._httpClient.post(
      '/api/auth/sign-in' satisfies Route,
      data,
    );

    if (!fetchResult.success) {
      return Result.fail({ message: fetchResult.error.message });
    }

    const validator = await dependencyContainer.resolveValidator({
      schema: signInApiResponseSchema,
      errorMessage: 'Invalid API response format.',
    });

    const validationResult = validator.validate(fetchResult.data);

    if (!validationResult.success) {
      return Result.fail({ message: validationResult.error.message });
    }

    const apiResponseResult = validationResult.data;

    if (!apiResponseResult.success) {
      return Result.fail({ message: apiResponseResult.error.message });
    }

    const userDto = apiResponseResult.data;

    return Result.ok(userDto);
  }

  async passwordChange(contract: PasswordChangeContract) {
    const data = JSON.stringify(contract);

    const fetchResult = await this._httpClient.patch(
      '/api/auth/password-change' satisfies Route,
      data,
    );

    if (!fetchResult.success) {
      return Result.fail({ message: fetchResult.error.message });
    }

    const validator = await dependencyContainer.resolveValidator({
      schema: passwordChangeApiResponseSchema,
      errorMessage: 'Invalid API response format.',
    });

    const validationResult = validator.validate(fetchResult.data);

    if (!validationResult.success) {
      return Result.fail({ message: validationResult.error.message });
    }

    const apiResponseResult = validationResult.data;

    if (!apiResponseResult.success) {
      return Result.fail({ message: apiResponseResult.error.message });
    }

    const userDto = apiResponseResult.data;

    return Result.ok(userDto);
  }
}
