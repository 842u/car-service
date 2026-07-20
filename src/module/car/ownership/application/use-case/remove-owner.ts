import { ownershipDomainErrorToApplicationError } from '@/car/ownership/application/mapper/error';
import type { OwnershipRepository } from '@/car/ownership/application/repository/ownership';
import type { OwnershipVisibility } from '@/car/ownership/application/service/visibility';
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
  private readonly _ownershipVisibility: OwnershipVisibility;
  private readonly _ownershipRepository: OwnershipRepository;

  constructor(
    authClient: AuthClient,
    ownershipVisibility: OwnershipVisibility,
    ownershipRepository: OwnershipRepository,
  ) {
    this._authClient = authClient;
    this._ownershipVisibility = ownershipVisibility;
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

    const visibilityResult = await this._ownershipVisibility.resolve(
      carId,
      actingId,
    );

    if (!visibilityResult.success) {
      return Result.fail(visibilityResult.error);
    }

    const ownership = visibilityResult.data;

    const removeOwnerResult = ownership.removeOwner(actingId, ownerId);

    if (!removeOwnerResult.success) {
      return Result.fail(
        ownershipDomainErrorToApplicationError(removeOwnerResult.error),
      );
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
