import type { Result } from '@/common/application/result/result';
import type { UserDto } from '@/user/application/dtos/user-dto';
import type { PasswordChangeContract } from '@/user/interface/contracts/password-change.schema';
import type { SignInContract } from '@/user/interface/contracts/sign-in.schema';
import type { SignUpContract } from '@/user/interface/contracts/sign-up.schema';

type AuthApiClientError = { message: string };

export interface IAuthApiClient {
  signUp(
    contract: SignUpContract,
  ): Promise<Result<UserDto, AuthApiClientError>>;
  signIn(
    contract: SignInContract,
  ): Promise<Result<UserDto, AuthApiClientError>>;
  passwordChange(
    contract: PasswordChangeContract,
  ): Promise<Result<UserDto, AuthApiClientError>>;
}
