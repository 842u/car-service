import type { Route } from 'next';

import type {
  AuthApiService,
  Credentials,
} from '@/auth/application/ports/auth-api-service.port';
import { validateSignInApiResponse } from '@/auth/credentials/interface/validation/api/sign-in.schema';
import type { FetchClient } from '@/common/infrastructure/adapters/fetch-client.adapter';
import { Result } from '@/common/interface/result/result';
import { validateSignUpApiResponse } from '@/features/auth/credentials/interface/validation/api/sign-up.schema';

export class NextAuthApiService implements AuthApiService {
  private _httpClient: FetchClient;

  constructor(httpClient: FetchClient) {
    this._httpClient = httpClient;
  }

  async signUp(credentials: Credentials) {
    const data = JSON.stringify(credentials);

    const fetchResult = await this._httpClient.post(
      '/api/auth/sign-up' satisfies Route,
      data,
    );

    if (!fetchResult.success) {
      return Result.fail({ message: fetchResult.error.message });
    }

    const validationResult = validateSignUpApiResponse(fetchResult.data);

    if (!validationResult.success) {
      return Result.fail({ message: validationResult.error.message });
    }

    const apiResponseResult = validationResult.data;

    if (!apiResponseResult.success) {
      return Result.fail({ message: apiResponseResult.error.message });
    }

    return Result.ok({ id: apiResponseResult.data.id });
  }

  async signIn(credentials: Credentials) {
    const data = JSON.stringify(credentials);

    const fetchResult = await this._httpClient.post(
      '/api/auth/sign-in' satisfies Route,
      data,
    );

    if (!fetchResult.success) {
      return Result.fail({ message: fetchResult.error.message });
    }

    const validationResult = validateSignInApiResponse(fetchResult.data);

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
