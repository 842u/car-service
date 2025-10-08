import { NextApiHandler } from '@/common/infrastructure/api-handler/next-api-handler';
import { validator } from '@/dependencies/validator';
import type {
  AvatarUrlChangeApiRequest,
  AvatarUrlChangeApiResponseData,
  AvatarUrlChangeApiResponseError,
} from '@/user/interface/api/avatar-change.schema';
import type {
  NameChangeApiRequest,
  NameChangeApiResponseData,
  NameChangeApiResponseError,
} from '@/user/interface/api/name-change.schema';
import type {
  PasswordChangeApiRequest,
  PasswordChangeApiResponseData,
  PasswordChangeApiResponseError,
} from '@/user/interface/api/password-change.schema';
import type {
  SignInApiRequest,
  SignInApiResponseData,
  SignInApiResponseError,
} from '@/user/interface/api/sign-in.schema';
import type {
  SignUpApiRequest,
  SignUpApiResponseData,
  SignUpApiResponseError,
} from '@/user/interface/api/sign-up.schema';

export const avatarUrlChangeApiHandler = new NextApiHandler<
  AvatarUrlChangeApiResponseData,
  AvatarUrlChangeApiResponseError,
  AvatarUrlChangeApiRequest
>(validator);

export const nameChangeApiHandler = new NextApiHandler<
  NameChangeApiResponseData,
  NameChangeApiResponseError,
  NameChangeApiRequest
>(validator);

export const passwordChangeApiHandler = new NextApiHandler<
  PasswordChangeApiResponseData,
  PasswordChangeApiResponseError,
  PasswordChangeApiRequest
>(validator);

export const signInApiHandler = new NextApiHandler<
  SignInApiResponseData,
  SignInApiResponseError,
  SignInApiRequest
>(validator);

export const signUpApiHandler = new NextApiHandler<
  SignUpApiResponseData,
  SignUpApiResponseError,
  SignUpApiRequest
>(validator);
