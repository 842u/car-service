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
import type { SignInApiRequest } from '@/user/interface/api/sign-in.schema';

export class SignInUseCase implements UseCase<SignInApiRequest, UserDto> {
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
    contract: SignInApiRequest,
  ): Promise<Result<UserDto, ApplicationError>> {
    const { email, password } = contract;

    const signInResult = await this._authClient.signIn({ email, password });

    if (!signInResult.success) {
      const { message } = signInResult.error;
      return Result.fail(applicationError.unauthorized(message));
    }

    const authIdentity = signInResult.data;

    const getUserResult = await this._userRepository.getById(authIdentity.id);

    if (!getUserResult.success) {
      const { message } = getUserResult.error;
      return Result.fail(applicationError.unexpected(message));
    }

    return Result.ok(this._userMapper.domainToDto(getUserResult.data));
  }
}
