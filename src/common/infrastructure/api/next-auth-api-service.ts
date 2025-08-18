import type { Route } from 'next';

import type { AuthApiService } from '@/common/application/api/auth-api-service.interface';
import type { FetchClient } from '@/common/infrastructure/http/fetch-client';
import { Result } from '@/common/interface/result/result';
import type { CredentialsDto } from '@/user/application/dtos/credentials/credentials.dto';
import { signInApiResponseValidator } from '@/user/interface/validation/api/sign-in.schema';
import { signUpApiResponseValidator } from '@/user/interface/validation/api/sign-up.schema';

export class NextAuthApiService implements AuthApiService {
  private _httpClient: FetchClient;

  constructor(httpClient: FetchClient) {
    this._httpClient = httpClient;
  }

  async signUp(credentials: CredentialsDto) {
    const data = JSON.stringify(credentials);

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

  async signIn(credentials: CredentialsDto) {
    const data = JSON.stringify(credentials);

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
}
