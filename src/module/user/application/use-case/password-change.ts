import type { AuthClient } from '@/common/application/auth-client';
import {
  type ApplicationError,
  applicationError,
} from '@/common/application/error';
import { Result } from '@/common/application/result';
import type { UseCase } from '@/common/application/use-case';
import type { UserDto } from '@/user/application/dto/user';
import type { UserMapper } from '@/user/application/mapper/user';
import type { UserRepository } from '@/user/application/repository/user';
import { Password } from '@/user/domain/user/value-object/password/password';
import type { PasswordChangeApiRequest } from '@/user/interface/api/password-change.schema';

export class PasswordChangeUseCase implements UseCase<
  PasswordChangeApiRequest,
  UserDto
> {
  private readonly _authClient: AuthClient;
  private readonly _userRepository: UserRepository;
  private readonly _userMapper: UserMapper;

  constructor(
    authClient: AuthClient,
    userRepository: UserRepository,
    userMapper: UserMapper,
  ) {
    this._authClient = authClient;
    this._userRepository = userRepository;
    this._userMapper = userMapper;
  }

  async execute(
    contract: PasswordChangeApiRequest,
  ): Promise<Result<UserDto, ApplicationError>> {
    const { password: passwordDto, passwordConfirm } = contract;

    if (passwordDto !== passwordConfirm) {
      return Result.fail(
        applicationError.validation('Passwords do not match.'),
      );
    }

    const passwordResult = Password.create(passwordDto);

    if (!passwordResult.success) {
      const { message, issues } = passwordResult.error;
      return Result.fail(applicationError.validation(message, issues));
    }

    const password = passwordResult.data.value;

    const updateResult = await this._authClient.changePassword({ password });

    if (!updateResult.success) {
      const { message } = updateResult.error;
      return Result.fail(applicationError.unauthorized(message));
    }

    const authIdentity = updateResult.data;

    const getUserResult = await this._userRepository.getById(authIdentity.id);

    if (!getUserResult.success) {
      const { message } = getUserResult.error;
      return Result.fail(applicationError.unexpected(message));
    }

    const user = getUserResult.data;

    return Result.ok(this._userMapper.domainToDto(user));
  }
}
