import type { Route } from 'next';

import type { AuthApiService } from '@/common/application/api/auth-api-service.interface';
import type { FetchClient } from '@/common/infrastructure/http/fetch-client';
import { Result } from '@/common/interface/result/result';
import { signInApiResponseValidator } from '@/user/interface/api/sign-in.schema';
import { signUpApiResponseValidator } from '@/user/interface/api/sign-up.schema';
import type { PasswordChangeContract } from '@/user/interface/contracts/password-change.schema';
import type { SignInContract } from '@/user/interface/contracts/sign-in.schema';
import type { SignUpContract } from '@/user/interface/contracts/sign-up.schema';

export class NextAuthApiService implements AuthApiService {
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

    const validationResult = signUpApiResponseValidator.validate(
      fetchResult.data,
    );

    if (!validationResult.success) {
      return Result.fail({ message: validationResult.error.message });
    }

    const apiResponseResult = validationResult.data;

    if (!apiResponseResult.success) {
      return Result.fail({ message: apiResponseResult.error.message });
    }

    return Result.ok({ id: apiResponseResult.data.id });
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

    const validationResult = signInApiResponseValidator.validate(
      fetchResult.data,
    );

    if (!validationResult.success) {
      return Result.fail({ message: validationResult.error.message });
    }

    const apiResponseResult = validationResult.data;

    if (!apiResponseResult.success) {
      return Result.fail({ message: apiResponseResult.error.message });
    }

    return Result.ok({ id: apiResponseResult.data.id });
  }

  async passwordChange(contract: PasswordChangeContract) {
    const data = JSON.stringify(contract);

    const fetchResult = await this._httpClient.post(
      '/api/auth/password-change' satisfies Route,
      data,
    );

    if (!fetchResult.success) {
      return Result.fail({ message: fetchResult.error.message });
    }

    const validationResult = signUpApiResponseValidator.validate(
      fetchResult.data,
    );

    if (!validationResult.success) {
      return Result.fail({ message: validationResult.error.message });
    }

    const apiResponseResult = validationResult.data;

    if (!apiResponseResult.success) {
      return Result.fail({ message: apiResponseResult.error.message });
    }

    return Result.ok({ id: apiResponseResult.data.id });
  }
}
