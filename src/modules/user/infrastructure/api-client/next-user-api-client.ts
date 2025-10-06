import type { Route } from 'next';

import type { HttpClient } from '@/common/application/http-client/http-client.interface';
import { Result } from '@/common/application/result/result';
import type { Validator } from '@/common/application/validator/validator.interface';
import type { IUserApiClient } from '@/user/application/api-client/user-api-client.interface';
import type { UserDto } from '@/user/application/dtos/user-dto';
import type { UserAvatarUrlChangeApiContract } from '@/user/interface/api/avatar-change.schema';
import type { UserNameChangeApiContract } from '@/user/interface/api/name-change.schema';
import { userNameChangeApiResponseSchema } from '@/user/interface/api/name-change.schema';
import type { PasswordChangeApiContract } from '@/user/interface/api/password-change.schema';
import { passwordChangeApiResponseSchema } from '@/user/interface/api/password-change.schema';
import type { SignInApiContract } from '@/user/interface/api/sign-in.schema';
import { signInApiResponseSchema } from '@/user/interface/api/sign-in.schema';
import type { SignUpApiContract } from '@/user/interface/api/sign-up.schema';
import { signUpApiResponseSchema } from '@/user/interface/api/sign-up.schema';

export class NextUserApiClient implements IUserApiClient {
  private readonly _httpClient: HttpClient;
  private readonly _validator: Validator;

  constructor(httpClient: HttpClient, validator: Validator) {
    this._httpClient = httpClient;
    this._validator = validator;
  }

  async signUp(contract: SignUpApiContract) {
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

  async signIn(contract: SignInApiContract) {
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

  async passwordChange(contract: PasswordChangeApiContract) {
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
    contract: UserNameChangeApiContract,
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

  async avatarChange(
    contract: UserAvatarUrlChangeApiContract,
  ): Promise<Result<UserDto, { message: string }>> {
    const data = JSON.stringify(contract);

    const requestResult = await this._httpClient.patch(
      '/api/user/avatar' satisfies Route,
      data,
    );

    if (!requestResult.success) {
      return Result.fail({ message: requestResult.error.message });
    }

    const validationResult = this._validator.validate(
      requestResult.data,
      userNameChangeApiResponseSchema,
      'API response validation failed.',
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
