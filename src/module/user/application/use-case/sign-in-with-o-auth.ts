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

type SignInWithOAuthContract = {
  code: string;
};

export class SignInWithOAuthUseCase implements UseCase<
  SignInWithOAuthContract,
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
    contract: SignInWithOAuthContract,
  ): Promise<Result<UserDto, ApplicationError>> {
    const { code } = contract;
    /**
     * Exchanging code for session will either retrieve an existing auth identity or create a new one.
     */
    const exchangeResult = await this._authClient.exchangeCodeForSession(code);

    if (!exchangeResult.success) {
      const { message } = exchangeResult.error;
      return Result.fail(applicationError.unauthorized(message));
    }

    const authIdentity = exchangeResult.data;

    const getUserResult = await this._userRepository.getById(authIdentity.id);

    if (getUserResult.success) {
      return Result.ok(this._userMapper.domainToDto(getUserResult.data));
    }

    /**
     * If there is no user, that means it's a first time sign-in, so create and store a new user.
     */
    const userResult = this._userMapper.authIdentityToDomain(authIdentity);

    if (!userResult.success) {
      const { message } = userResult.error;
      return Result.fail(applicationError.unexpected(message));
    }

    const storeUserResult = await this._userRepository.store(userResult.data);

    if (!storeUserResult.success) {
      const { message } = storeUserResult.error;
      return Result.fail(applicationError.unexpected(message));
    }

    return Result.ok(this._userMapper.domainToDto(userResult.data));
  }
}
