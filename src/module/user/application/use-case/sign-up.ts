import type { AdminAuthClient } from '@/common/application/auth-client';
import {
  type ApplicationError,
  applicationError,
} from '@/common/application/error';
import { Result } from '@/common/application/result';
import type { UseCase } from '@/common/application/use-case';
import type { UserDto } from '@/user/application/dto/user';
import type { UserMapper } from '@/user/application/mapper/user';
import type { UserRepository } from '@/user/application/repository/user';
import { User } from '@/user/domain/user/user';
import { Email } from '@/user/domain/user/value-object/email/email';
import { Password } from '@/user/domain/user/value-object/password/password';
import type { SignUpApiRequest } from '@/user/interface/api/sign-up.schema';

export class SignUpUseCase implements UseCase<SignUpApiRequest, UserDto> {
  private readonly _adminAuthClient: AdminAuthClient;
  private readonly _userRepository: UserRepository;
  private readonly _userMapper: UserMapper;
  private readonly _origin: string;

  constructor(
    adminAuthClient: AdminAuthClient,
    userRepositoryAdmin: UserRepository,
    userMapper: UserMapper,
    origin: string,
  ) {
    this._adminAuthClient = adminAuthClient;
    this._userRepository = userRepositoryAdmin;
    this._userMapper = userMapper;
    this._origin = origin;
  }

  async execute(
    contract: SignUpApiRequest,
  ): Promise<Result<UserDto, ApplicationError>> {
    const { email, password } = contract;

    const emailResult = Email.create(email);

    if (!emailResult.success) {
      const { message, issues } = emailResult.error;
      return Result.fail(applicationError.validation(message, issues));
    }

    const passwordResult = Password.create(password);

    if (!passwordResult.success) {
      const { message, issues } = passwordResult.error;
      return Result.fail(applicationError.validation(message, issues));
    }

    const createAuthIdentityResult =
      await this._adminAuthClient.createAuthIdentity({
        email,
        password,
        email_confirm: false,
      });

    if (!createAuthIdentityResult.success) {
      const { message, code } = createAuthIdentityResult.error;

      if (code !== 'email_exists' && code !== 'user_already_exists') {
        return Result.fail(applicationError.unexpected(message));
      }

      /**
       * If auth identity/user already exists, send password reset email and return obfuscated user to not expose such information to threat actors.
       */
      const resetPasswordResult = await this._adminAuthClient.resetPassword({
        email,
        options: {
          redirectTo: `${this._origin}/dashboard`,
        },
      });

      if (!resetPasswordResult.success) {
        const { message } = resetPasswordResult.error;
        return Result.fail(applicationError.unexpected(message));
      }

      const obfuscatedId = crypto.randomUUID();

      const obfuscatedUserResult = User.create({
        id: obfuscatedId,
        email,
        name: `user-${obfuscatedId.substring(0, 8)}`,
      });

      if (!obfuscatedUserResult.success) {
        const { message } = obfuscatedUserResult.error;
        return Result.fail(applicationError.unexpected(message));
      }

      return Result.ok(this._userMapper.domainToDto(obfuscatedUserResult.data));
    }

    const authIdentity = createAuthIdentityResult.data;

    if (!authIdentity) {
      return Result.fail(
        applicationError.unexpected('Cannot get authentication identity.'),
      );
    }

    const userResult = this._userMapper.authIdentityToDomain(authIdentity);

    if (!userResult.success) {
      await this._adminAuthClient.deleteAuthIdentity({
        id: authIdentity.id,
      });
      const { message } = userResult.error;
      return Result.fail(applicationError.unexpected(message));
    }

    const storeUserResult = await this._userRepository.store(userResult.data);

    if (!storeUserResult.success) {
      await this._adminAuthClient.deleteAuthIdentity({
        id: authIdentity.id,
      });
      const { message } = storeUserResult.error;
      return Result.fail(applicationError.unexpected(message));
    }

    const sendConfirmationEmailResult =
      await this._adminAuthClient.sendConfirmationEmail({
        email: userResult.data.email.value,
        redirectTo: `${this._origin}/api/auth/otp`,
      });

    if (!sendConfirmationEmailResult.success) {
      await this._adminAuthClient.deleteAuthIdentity({
        id: authIdentity.id,
      });
      const { message } = sendConfirmationEmailResult.error;
      return Result.fail(applicationError.unexpected(message));
    }

    return Result.ok(this._userMapper.domainToDto(userResult.data));
  }
}
