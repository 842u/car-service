import { NextApiHandler } from '@/common/infrastructure/api-handler/next';
import { validator } from '@/dependency/validator';
import type {
  EditUserApiRequest,
  EditUserApiResponseData,
  EditUserApiResponseError,
} from '@/user/interface/api/edit.schema';
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

export const editUserApiHandler = new NextApiHandler<
  EditUserApiResponseData,
  EditUserApiResponseError,
  EditUserApiRequest
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
