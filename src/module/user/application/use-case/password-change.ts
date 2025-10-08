import type { AuthClient } from '@/common/application/auth-client/auth-client';
import { Result } from '@/common/application/result/result';
import type { UseCase } from '@/common/application/use-case/use-case';
import type { UserRepository } from '@/user/application/repository/user';
import { Password } from '@/user/domain/user/value-object/password/password';
import type { PasswordChangeApiRequest } from '@/user/interface/api/password-change.schema';

type UserPasswordChangeUseCaseError = { code: number };

export class UserPasswordChangeUseCase
  implements UseCase<PasswordChangeApiRequest, UserPasswordChangeUseCaseError>
{
  private readonly _authClient: AuthClient;
  private readonly _userRepository: UserRepository;

  constructor(authClient: AuthClient, userRepository: UserRepository) {
    this._authClient = authClient;
    this._userRepository = userRepository;
  }

  async execute(contract: PasswordChangeApiRequest) {
    const { password: passwordDto, passwordConfirm } = contract;

    if (passwordDto !== passwordConfirm) {
      return Result.fail({ message: 'Passwords do not match.', code: 400 });
    }

    const passwordResult = Password.create(passwordDto);

    if (!passwordResult.success) {
      const { message } = passwordResult.error;

      return Result.fail({ message, code: 422 });
    }

    const password = passwordResult.data.value;

    const updateResult = await this._authClient.updateUser({
      attributes: { password },
    });

    if (!updateResult.success) {
      const { message } = updateResult.error;
      return Result.fail({ message, code: 401 });
    }

    const authIdentity = updateResult.data;

    const getUserResult = await this._userRepository.getById(authIdentity.id);

    if (!getUserResult.success) {
      const { message } = getUserResult.error;
      return Result.fail({ message, code: 500 });
    }

    const user = getUserResult.data;

    return Result.ok(user);
  }
}
