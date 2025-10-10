import type { AuthClient } from '@/common/application/auth-client';
import { Result } from '@/common/application/result';
import type { UseCase } from '@/common/application/use-case';
import type { UserRepository } from '@/user/application/repository/user';
import type { AvatarUrlChangeApiRequest } from '@/user/interface/api/avatar-change.schema';

type AvatarUrlChangeUseCaseError = { code: number };

export class AvatarUrlChangeUseCase
  implements UseCase<AvatarUrlChangeApiRequest, AvatarUrlChangeUseCaseError>
{
  private readonly _authClient: AuthClient;
  private readonly _userRepository: UserRepository;

  constructor(authClient: AuthClient, userRepository: UserRepository) {
    this._authClient = authClient;
    this._userRepository = userRepository;
  }

  async execute(contract: AvatarUrlChangeApiRequest) {
    const sessionResult = await this._authClient.authenticate();

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

    const { avatarUrl } = contract;

    const changeAvatarUrlResult = user.changeAvatarUrl(avatarUrl);

    if (!changeAvatarUrlResult.success) {
      const { message, issues } = changeAvatarUrlResult.error;
      return Result.fail({ message, issues, code: 400 });
    }

    const persistenceUserChangeResult =
      await this._userRepository.changeAvatarUrl(user);

    if (!persistenceUserChangeResult.success) {
      const { message } = persistenceUserChangeResult.error;
      return Result.fail({ message, code: 500 });
    }

    return Result.ok(user);
  }
}
