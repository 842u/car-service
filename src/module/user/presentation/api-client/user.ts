import type { Result } from '@/common/application/result';
import type { UserDto } from '@/user/application/dto/user';
import type { EditUserApiRequest } from '@/user/interface/api/edit.schema';
import type { PasswordChangeApiRequest } from '@/user/interface/api/password-change.schema';
import type { SignInApiRequest } from '@/user/interface/api/sign-in.schema';
import type { SignUpApiRequest } from '@/user/interface/api/sign-up.schema';

type UserApiClientError = { message: string };

export interface UserApiClient {
  signUp(
    contract: SignUpApiRequest,
  ): Promise<Result<UserDto, UserApiClientError>>;
  signIn(
    contract: SignInApiRequest,
  ): Promise<Result<UserDto, UserApiClientError>>;
  passwordChange(
    contract: PasswordChangeApiRequest,
  ): Promise<Result<UserDto, UserApiClientError>>;
  edit(
    contract: EditUserApiRequest,
  ): Promise<Result<UserDto, UserApiClientError>>;
}
