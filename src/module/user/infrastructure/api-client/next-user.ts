import type { Route } from 'next';

import type { ApiRequester } from '@/common/application/api-requester';
import {
  type EditUserApiRequest,
  editUserApiResponseSchema,
} from '@/user/interface/api/edit.schema';
import type { PasswordChangeApiRequest } from '@/user/interface/api/password-change.schema';
import { passwordChangeApiResponseSchema } from '@/user/interface/api/password-change.schema';
import type { SignInApiRequest } from '@/user/interface/api/sign-in.schema';
import { signInApiResponseSchema } from '@/user/interface/api/sign-in.schema';
import type { SignUpApiRequest } from '@/user/interface/api/sign-up.schema';
import { signUpApiResponseSchema } from '@/user/interface/api/sign-up.schema';
import type { UserApiClient } from '@/user/presentation/api-client/user';

const SIGN_UP_ENDPOINT: Route = '/api/auth/sign-up';
const SIGN_IN_ENDPOINT: Route = '/api/auth/sign-in';
const PASSWORD_CHANGE_ENDPOINT: Route = '/api/auth/password-change';
const USER_ENDPOINT: Route = '/api/user';

export class NextUserApiClient implements UserApiClient {
  private readonly _apiRequester: ApiRequester;

  constructor(apiRequester: ApiRequester) {
    this._apiRequester = apiRequester;
  }

  async signUp(contract: SignUpApiRequest) {
    return this._apiRequester.send(
      'POST',
      SIGN_UP_ENDPOINT,
      contract,
      signUpApiResponseSchema,
    );
  }

  async signIn(contract: SignInApiRequest) {
    return this._apiRequester.send(
      'POST',
      SIGN_IN_ENDPOINT,
      contract,
      signInApiResponseSchema,
    );
  }

  async passwordChange(contract: PasswordChangeApiRequest) {
    return this._apiRequester.send(
      'PATCH',
      PASSWORD_CHANGE_ENDPOINT,
      contract,
      passwordChangeApiResponseSchema,
    );
  }

  async edit(contract: EditUserApiRequest) {
    return this._apiRequester.send(
      'PATCH',
      USER_ENDPOINT,
      contract,
      editUserApiResponseSchema,
    );
  }
}
