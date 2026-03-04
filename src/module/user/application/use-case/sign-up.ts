import type { Route } from 'next';

import type { AdminAuthClient } from '@/common/application/auth-client';
import { Result } from '@/common/application/result';
import type { UseCase } from '@/common/application/use-case';
import type { UserMapper } from '@/user/application/mapper/user';
import type { UserRepository } from '@/user/application/repository/user';
import { User } from '@/user/domain/user/user';
import { Credentials } from '@/user/domain/user/value-object/credentials';
import type { SignUpApiRequest } from '@/user/interface/api/sign-up.schema';

type SignUpUseCaseError = { code: number };

export class SignUpUseCase implements UseCase<
  SignUpApiRequest,
  SignUpUseCaseError
> {
  private readonly _adminAuthClient: AdminAuthClient;
  private readonly _userRepository: UserRepository;
  private readonly _userMapper: UserMapper;

  constructor(
    adminAuthClient: AdminAuthClient,
    userRepositoryAdmin: UserRepository,
    userMapper: UserMapper,
  ) {
    this._adminAuthClient = adminAuthClient;
    this._userRepository = userRepositoryAdmin;
    this._userMapper = userMapper;
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

    const createAuthIdentityResult =
      await this._adminAuthClient.createAuthIdentity({
        email,
        password,
        email_confirm: false,
      });

    if (!createAuthIdentityResult.success) {
      const { message, code, status } = createAuthIdentityResult.error;

      if (code !== 'email_exists' && code !== 'user_already_exists')
        return Result.fail({ message, code: status || 500 });

      /**
       * If auth identity/user already exists, send password reset email and return obfuscated user to not expose such information to threat actors.
       */
      const resetPasswordResult = await this._adminAuthClient.resetPassword({
        email,
        options: {
          redirectTo: '/dashboard' satisfies Route,
        },
      });

      if (!resetPasswordResult.success) {
        const { message, status } = resetPasswordResult.error;
        return Result.fail({ message, code: status || 500 });
      }

      const obfuscatedId = crypto.randomUUID();

      const obfuscatedUserResult = User.create({
        id: obfuscatedId,
        email: email,
        name: `user-${obfuscatedId.substring(0, 8)}`,
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

    const userResult = this._userMapper.authIdentityToDomain(authIdentity);

    if (!userResult.success) {
      await this._adminAuthClient.deleteAuthIdentity({
        id: authIdentity.id,
      });
      const { message } = userResult.error;
      return Result.fail({ message, code: 422 });
    }

    const storeUserResult = await this._userRepository.store(userResult.data);

    if (!storeUserResult.success) {
      await this._adminAuthClient.deleteAuthIdentity({
        id: authIdentity.id,
      });
      const { message } = storeUserResult.error;
      return Result.fail({
        message,
        code: 500,
      });
    }

    const sendConfirmationEmailResult =
      await this._adminAuthClient.sendConfirmationEmail({
        email: userResult.data.email.value,
        redirectTo: '/dashboard' satisfies Route,
      });

    if (!sendConfirmationEmailResult.success) {
      await this._adminAuthClient.deleteAuthIdentity({
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
