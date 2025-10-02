import type { Route } from 'next';

import { Result } from '@/common/application/result/result';
import type { IValidator } from '@/common/application/validator/validator.interface';
import type { FetchClient } from '@/common/infrastructure/http/fetch-client';
import type { IUserApiClient } from '@/user/application/api-client/user-api-client.interface';
import type { UserDto } from '@/user/application/dtos/user-dto';
import { userNameChangeApiResponseSchema } from '@/user/interface/api/name-change.schema';
import { passwordChangeApiResponseSchema } from '@/user/interface/api/password-change.schema';
import { signInApiResponseSchema } from '@/user/interface/api/sign-in.schema';
import { signUpApiResponseSchema } from '@/user/interface/api/sign-up.schema';
import type { UserNameChangeContract } from '@/user/interface/contracts/name-change.schema';
import type { PasswordChangeContract } from '@/user/interface/contracts/password-change.schema';
import type { SignInContract } from '@/user/interface/contracts/sign-in.schema';
import type { SignUpContract } from '@/user/interface/contracts/sign-up.schema';

export class NextUserApiClient implements IUserApiClient {
  private readonly _httpClient: FetchClient;
  private readonly _validator: IValidator;

  constructor(httpClient: FetchClient, validator: IValidator) {
    this._httpClient = httpClient;
    this._validator = validator;
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

    const validationResult = this._validator.validate(
      fetchResult.data,
      signUpApiResponseSchema,
    );

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

    const validationResult = this._validator.validate(
      fetchResult.data,
      signInApiResponseSchema,
    );

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

    const validationResult = this._validator.validate(
      fetchResult.data,
      passwordChangeApiResponseSchema,
    );

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

  async nameChange(
    contract: UserNameChangeContract,
  ): Promise<Result<UserDto, { message: string }>> {
    const data = JSON.stringify(contract);

    const requestResult = await this._httpClient.patch(
      '/api/user/name' satisfies Route,
      data,
    );

    if (!requestResult.success) {
      return Result.fail({ message: requestResult.error.message });
    }

    const validationResult = this._validator.validate(
      requestResult.data,
      userNameChangeApiResponseSchema,
    );

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
