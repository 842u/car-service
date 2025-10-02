import type { Result } from '@/common/application/result/result';
import type { UserDto } from '@/user/application/dtos/user-dto';
import type { UserNameChangeApiContract } from '@/user/interface/api/name-change.schema';
import type { PasswordChangeApiContract } from '@/user/interface/api/password-change.schema';
import type { SignInApiContract } from '@/user/interface/api/sign-in.schema';
import type { SignUpApiContract } from '@/user/interface/api/sign-up.schema';

type UserApiClientError = { message: string };

export interface IUserApiClient {
  signUp(
    contract: SignUpApiContract,
  ): Promise<Result<UserDto, UserApiClientError>>;
  signIn(
    contract: SignInApiContract,
  ): Promise<Result<UserDto, UserApiClientError>>;
  passwordChange(
    contract: PasswordChangeApiContract,
  ): Promise<Result<UserDto, UserApiClientError>>;
  nameChange(
    contract: UserNameChangeApiContract,
  ): Promise<Result<UserDto, UserApiClientError>>;
}
