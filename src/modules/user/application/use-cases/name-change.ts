import { Result } from '@/common/application/result/result';
import type { UseCase } from '@/common/application/use-case/use-case.interface';
import type { SupabaseAuthClient } from '@/common/infrastructure/auth/supabase-auth-client';
import type { UserRepository } from '@/user/infrastructure/repositories/user-repository';
import type { UserNameChangeApiContract } from '@/user/interface/api/name-change.schema';

type UserNameChangeUseCaseError = { code: number };

export class UserNameChangeUseCase
  implements UseCase<UserNameChangeApiContract, UserNameChangeUseCaseError>
{
  private readonly _authClient: SupabaseAuthClient;
  private readonly _userRepository: UserRepository;

  constructor(authClient: SupabaseAuthClient, userRepository: UserRepository) {
    this._authClient = authClient;
    this._userRepository = userRepository;
  }

  async execute(contract: UserNameChangeApiContract) {
    const sessionResult = await this._authClient.getSession();

    if (!sessionResult.success) {
      const { message, status } = sessionResult.error;
      return Result.fail({ message, code: status || 401 });
    }

    const { user: authIdentity } = sessionResult.data;

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
