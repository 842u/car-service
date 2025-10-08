import type { Result } from '@/common/application/result';
import type { UserDto } from '@/user/application/dto/user';
import type { AvatarUrlChangeApiRequest } from '@/user/interface/api/avatar-change.schema';
import type { NameChangeApiRequest } from '@/user/interface/api/name-change.schema';
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
  nameChange(
    contract: NameChangeApiRequest,
  ): Promise<Result<UserDto, UserApiClientError>>;
  avatarChange(
    contract: AvatarUrlChangeApiRequest,
  ): Promise<Result<UserDto, UserApiClientError>>;
}
