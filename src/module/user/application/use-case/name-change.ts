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
import type { NameChangeApiRequest } from '@/user/interface/api/name-change.schema';

export class NameChangeUseCase implements UseCase<
  NameChangeApiRequest,
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
    contract: NameChangeApiRequest,
  ): Promise<Result<UserDto, ApplicationError>> {
    const sessionResult = await this._authClient.authenticate();

    if (!sessionResult.success) {
      const { message } = sessionResult.error;
      return Result.fail(applicationError.unauthorized(message));
    }

    const authIdentity = sessionResult.data;

    const getUserResult = await this._userRepository.getById(authIdentity.id);

    if (!getUserResult.success) {
      const { message } = getUserResult.error;
      return Result.fail(applicationError.unexpected(message));
    }

    const user = getUserResult.data;

    const { name } = contract;

    const changeNameResult = user.changeName(name);

    if (!changeNameResult.success) {
      const { message, issues } = changeNameResult.error;
      return Result.fail(applicationError.validation(message, issues));
    }

    const updateResult = await this._userRepository.update(user);

    if (!updateResult.success) {
      const { message } = updateResult.error;
      return Result.fail(applicationError.unexpected(message));
    }

    return Result.ok(this._userMapper.domainToDto(user));
  }
}
