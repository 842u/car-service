import type { EmailOtpType } from '@supabase/supabase-js';

import type { AuthClient } from '@/common/application/auth-client';
import {
  type ApplicationError,
  applicationError,
} from '@/common/application/error';
import { Result } from '@/common/application/result';
import type { UseCase } from '@/common/application/use-case';
import type { UserDto } from '@/user/application/dto/user';
import type { UserMapper } from '@/user/application/mapper/user';
import type { SignInWithOtpApiRequest } from '@/user/interface/api/sign-in-with-otp.schema';

export class SignInWithOtpUseCase implements UseCase<
  SignInWithOtpApiRequest,
  UserDto
> {
  private readonly _authClient: AuthClient;
  private readonly _userMapper: UserMapper;

  constructor(authClient: AuthClient, userMapper: UserMapper) {
    this._authClient = authClient;
    this._userMapper = userMapper;
  }

  async execute(
    contract: SignInWithOtpApiRequest,
  ): Promise<Result<UserDto, ApplicationError>> {
    const { token_hash, type } = contract;

    const otpResult = await this._authClient.verifyOtp({
      type: type as EmailOtpType,
      token_hash,
    });

    if (!otpResult.success) {
      const { message } = otpResult.error;
      return Result.fail(applicationError.unauthorized(message));
    }

    const authIdentity = otpResult.data;

    if (!authIdentity) {
      return Result.fail(
        applicationError.unexpected('Cannot retrieve auth identity'),
      );
    }

    const userResult = this._userMapper.authIdentityToDomain(authIdentity);

    if (!userResult.success) {
      const { message } = userResult.error;
      return Result.fail(applicationError.unexpected(message));
    }

    return Result.ok(this._userMapper.domainToDto(userResult.data));
  }
}
