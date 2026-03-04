import type { AuthClient } from '@/common/application/auth-client';
import { Result } from '@/common/application/result';
import type { UseCase } from '@/common/application/use-case';
import type { UserMapper } from '@/user/application/mapper/user';
import type { UserRepository } from '@/user/application/repository/user';

type SignInWithOAuthContract = {
  code: string;
};

type SignInWithOAuthUseCaseError = {
  code: number;
};

export class SignInWithOAuthUseCase implements UseCase<
  SignInWithOAuthContract,
  SignInWithOAuthUseCaseError
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

  async execute(contract: SignInWithOAuthContract) {
    const { code } = contract;
    /**
     * Exchanging code for session will either retrieve an existing auth identity or create a new one.
     */
    const exchangeResult = await this._authClient.exchangeCodeForSession(code);

    if (!exchangeResult.success) {
      const { message, status } = exchangeResult.error;
      return Result.fail({ message, code: status || 500 });
    }

    const authIdentity = exchangeResult.data;

    const getUserResult = await this._userRepository.getById(authIdentity.id);

    if (getUserResult.success) return Result.ok(getUserResult.data);

    /**
     * If there is no user, that means it's a first time sign-in, so create and store a new user.
     */
    const userResult = this._userMapper.authIdentityToDomain(authIdentity);

    if (!userResult.success) {
      const { message } = userResult.error;
      return Result.fail({ message, code: 500 });
    }

    const storeUserResult = await this._userRepository.store(userResult.data);

    if (!storeUserResult.success) {
      const { message } = storeUserResult.error;
      return Result.fail({ message, code: 500 });
    }

    return Result.ok(userResult.data);
  }
}
