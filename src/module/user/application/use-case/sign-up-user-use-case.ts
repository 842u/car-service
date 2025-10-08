import type { User as AuthIdentity } from '@supabase/supabase-js';
import type { Route } from 'next';

import type { AuthClientAdmin } from '@/common/application/auth-client/auth-client';
import { Result } from '@/common/application/result/result';
import type { UseCase } from '@/common/application/use-case/use-case';
import type { UserRepository } from '@/user/application/repository/user-repository';
import { User } from '@/user/domain/user/user';
import { Credentials } from '@/user/domain/user/value-object/credentials';
import type { SignUpApiRequest } from '@/user/interface/api/sign-up.schema';

type SignUpUseCaseError = { code: number };

export class SignUpUserUseCase
  implements UseCase<SignUpApiRequest, SignUpUseCaseError>
{
  private readonly _authAdminClient: AuthClientAdmin<AuthIdentity>;
  private readonly _userRepository: UserRepository;

  constructor(
    authClientAdmin: AuthClientAdmin<AuthIdentity>,
    userRepositoryAdmin: UserRepository,
  ) {
    this._authAdminClient = authClientAdmin;
    this._userRepository = userRepositoryAdmin;
  }

  async execute(contract: SignUpApiRequest) {
    const { email: emailDto, password: passwordDto } = contract;

    const credentialsResult = Credentials.create(emailDto, passwordDto);
    if (!credentialsResult.success) {
      const { message } = credentialsResult.error;
      return Result.fail({ message, code: 422 });
    }
    const {
      email: { value: email },
      password: { value: password },
    } = credentialsResult.data;

    const createAuthIdentityResult = await this._authAdminClient.createUser({
      email,
      password,
      email_confirm: false,
    });

    if (!createAuthIdentityResult.success) {
      const { message, code, status } = createAuthIdentityResult.error;

      if (code !== 'email_exists')
        return Result.fail({ message, code: status || 500 });

      /**
       * If auth identity/user already exists, send password reset email and return obfuscated user to not expose such information to threat actors.
       */
      const resetPasswordResult = await this._authAdminClient.resetPassword({
        email,
        options: {
          redirectTo: '/dashboard' satisfies Route,
        },
      });

      if (!resetPasswordResult.success) {
        const { message, status } = resetPasswordResult.error;
        return Result.fail({ message, code: status || 500 });
      }

      const obfuscatedUserResult = User.create({
        id: crypto.randomUUID(),
        email: email,
        name: email,
      });

      if (!obfuscatedUserResult.success) {
        const { message } = obfuscatedUserResult.error;
        return Result.fail({ message, code: 500 });
      }

      return Result.ok(obfuscatedUserResult.data);
    }

    const authIdentity = createAuthIdentityResult.data;

    if (!authIdentity) {
      return Result.fail({
        message: 'Cannot get authentication identity.',
        code: 500,
      });
    }

    const userResult = User.create({
      id: authIdentity.id,
      email: authIdentity.email!,
      name:
        authIdentity.user_metadata?.full_name ||
        authIdentity.user_metadata?.first_name ||
        authIdentity.email ||
        authIdentity.id,
      avatarUrl: authIdentity.user_metadata?.avatar_url,
    });

    if (!userResult.success) {
      await this._authAdminClient.deleteUser({
        id: authIdentity.id,
      });
      const { message } = userResult.error;
      return Result.fail({ message, code: 422 });
    }

    const storeUserResult = await this._userRepository.store(userResult.data);

    if (!storeUserResult.success) {
      await this._authAdminClient.deleteUser({
        id: authIdentity.id,
      });
      const { message } = storeUserResult.error;
      return Result.fail({
        message,
        code: 500,
      });
    }

    const sendConfirmationEmailResult =
      await this._authAdminClient.sendConfirmationEmail({
        email: userResult.data.email.value,
        redirectTo: '/dashboard' satisfies Route,
      });

    if (!sendConfirmationEmailResult.success) {
      await this._authAdminClient.deleteUser({
        id: authIdentity.id,
      });
      const { message, status } = sendConfirmationEmailResult.error;
      return Result.fail({
        message,
        code: status || 500,
      });
    }

    return Result.ok(userResult.data);
  }
}
