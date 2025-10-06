import type { User as AuthIdentity } from '@supabase/supabase-js';

import type { AuthClient } from '@/common/application/auth-client/auth-client.interface';
import { Result } from '@/common/application/result/result';
import type { UseCase } from '@/common/application/use-case/use-case.interface';
import type { UserRepository } from '@/user/application/repository/user-repository.interface';
import type { UserNameChangeApiContract } from '@/user/interface/api/name-change.schema';

type UserNameChangeUseCaseError = { code: number };

export class UserNameChangeUseCase
  implements UseCase<UserNameChangeApiContract, UserNameChangeUseCaseError>
{
  private readonly _authClient: AuthClient<AuthIdentity>;
  private readonly _userRepository: UserRepository;

  constructor(
    authClient: AuthClient<AuthIdentity>,
    userRepository: UserRepository,
  ) {
    this._authClient = authClient;
    this._userRepository = userRepository;
  }

  async execute(contract: UserNameChangeApiContract) {
    const sessionResult = await this._authClient.getSession();

    if (!sessionResult.success) {
      const { message, status } = sessionResult.error;
      return Result.fail({ message, code: status || 401 });
    }

    const authIdentity = sessionResult.data;

    const getUserResult = await this._userRepository.getById(authIdentity.id);

    if (!getUserResult.success) {
      const { message } = getUserResult.error;
      return Result.fail({ message, code: 500 });
    }

    const user = getUserResult.data;

    const { name } = contract;

    const changeNameResult = user.changeName(name);

    if (!changeNameResult.success) {
      const { message, issues } = changeNameResult.error;
      return Result.fail({ message, issues, code: 400 });
    }

    const persistenceUserChangeResult =
      await this._userRepository.changeName(user);

    if (!persistenceUserChangeResult.success) {
      const { message } = persistenceUserChangeResult.error;
      return Result.fail({ message, code: 500 });
    }

    return Result.ok(user);
  }
}
