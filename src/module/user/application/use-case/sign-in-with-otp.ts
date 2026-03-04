import type { EmailOtpType } from '@supabase/supabase-js';

import type { AuthClient } from '@/common/application/auth-client';
import {
  type FailureResult,
  Result,
  type SuccessResult,
} from '@/common/application/result';
import type { UseCase } from '@/common/application/use-case';
import type { UserMapper } from '@/user/application/mapper/user';

type SignInWithOtpContract = {
  token_hash: string;
  type: string;
};

type SignInWithOtpUseCaseError = {
  code: number;
};

export class SignInWithOtpUseCase implements UseCase<
  SignInWithOtpContract,
  SignInWithOtpUseCaseError
> {
  private readonly _authClient: AuthClient;
  private readonly _userMapper: UserMapper;

  constructor(authClient: AuthClient, userMapper: UserMapper) {
    this._authClient = authClient;
    this._userMapper = userMapper;
  }

  async execute(
    contract: SignInWithOtpContract,
  ): Promise<
    | SuccessResult<unknown, object>
    | FailureResult<{ message: string } & SignInWithOtpUseCaseError, object>
  > {
    const { token_hash, type } = contract;

    const otpResult = await this._authClient.verifyOtp({
      type: type as EmailOtpType,
      token_hash,
    });

    if (!otpResult.success) {
      const { message, status } = otpResult.error;
      return Result.fail({ message, code: status || 500 });
    }

    const authIdentity = otpResult.data;

    if (!authIdentity) {
      return Result.fail({
        message: 'Cannot retrieve auth identity',
        code: 500,
      });
    }

    const userResult = this._userMapper.authIdentityToDomain(authIdentity);

    if (!userResult.success) {
      const { message } = userResult.error;
      return Result.fail({ message, code: 500 });
    }

    return Result.ok(userResult.data);
  }
}
