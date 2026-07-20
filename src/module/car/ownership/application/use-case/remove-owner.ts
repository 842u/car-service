import type { OwnershipRepository } from '@/car/ownership/application/repository/ownership';
import type { RemoveOwnerApiRequest } from '@/car/ownership/interface/api/remove.schema';
import type { AuthClient } from '@/common/application/auth-client';
import {
  type ApplicationError,
  applicationError,
} from '@/common/application/error';
import { Result } from '@/common/application/result';
import type { UseCase } from '@/common/application/use-case';

export class RemoveOwnerUseCase implements UseCase<
  RemoveOwnerApiRequest,
  null
> {
  private readonly _authClient: AuthClient;
  private readonly _ownershipRepository: OwnershipRepository;

  constructor(
    authClient: AuthClient,
    ownershipRepository: OwnershipRepository,
  ) {
    this._authClient = authClient;
    this._ownershipRepository = ownershipRepository;
  }

  async execute(
    contract: RemoveOwnerApiRequest,
  ): Promise<Result<null, ApplicationError>> {
    const sessionResult = await this._authClient.authenticate();

    if (!sessionResult.success) {
      const { message } = sessionResult.error;
      return Result.fail(applicationError.unauthorized(message));
    }

    const actingId = sessionResult.data.id;

    const { carId, ownerId } = contract;

    const getOwnershipResult =
      await this._ownershipRepository.getByCarId(carId);

    if (!getOwnershipResult.success) {
      const { message } = getOwnershipResult.error;
      return Result.fail(applicationError.notFound(message));
    }

    const ownership = getOwnershipResult.data;

    const removeOwnerResult = ownership.removeOwner(actingId, ownerId);

    if (!removeOwnerResult.success) {
      const { kind, message } = removeOwnerResult.error;

      if (kind === 'validation') {
        return Result.fail(
          applicationError.validation(message, removeOwnerResult.error.issues),
        );
      }

      if (kind === 'forbidden') {
        return Result.fail(applicationError.forbidden(message));
      }

      return Result.fail(applicationError.conflict(message));
    }

    const removedOwnerId = removeOwnerResult.data;

    const persistResult = await this._ownershipRepository.removeOwner(
      ownership,
      removedOwnerId,
    );

    if (!persistResult.success) {
      const { message } = persistResult.error;
      return Result.fail(applicationError.unexpected(message));
    }

    return Result.ok(null);
  }
}
