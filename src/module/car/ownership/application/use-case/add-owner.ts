import type { OwnershipDto } from '@/car/ownership/application/dto/ownership';
import { ownershipDomainErrorToApplicationError } from '@/car/ownership/application/mapper/error';
import type { OwnershipMapper } from '@/car/ownership/application/mapper/ownership';
import type { OwnershipRepository } from '@/car/ownership/application/repository/ownership';
import type { OwnershipVisibility } from '@/car/ownership/application/service/visibility';
import type { AddOwnerApiRequest } from '@/car/ownership/interface/api/add.schema';
import type { AuthClient } from '@/common/application/auth-client';
import {
  type ApplicationError,
  applicationError,
} from '@/common/application/error';
import { Result } from '@/common/application/result';
import type { UseCase } from '@/common/application/use-case';

export class AddOwnerUseCase implements UseCase<
  AddOwnerApiRequest,
  OwnershipDto[]
> {
  private readonly _authClient: AuthClient;
  private readonly _ownershipVisibility: OwnershipVisibility;
  private readonly _ownershipRepository: OwnershipRepository;
  private readonly _ownershipMapper: OwnershipMapper;

  constructor(
    authClient: AuthClient,
    ownershipVisibility: OwnershipVisibility,
    ownershipRepository: OwnershipRepository,
    ownershipMapper: OwnershipMapper,
  ) {
    this._authClient = authClient;
    this._ownershipVisibility = ownershipVisibility;
    this._ownershipRepository = ownershipRepository;
    this._ownershipMapper = ownershipMapper;
  }

  async execute(
    contract: AddOwnerApiRequest,
  ): Promise<Result<OwnershipDto[], ApplicationError>> {
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

    const addOwnerResult = ownership.addOwner(actingId, ownerId);

    if (!addOwnerResult.success) {
      return Result.fail(
        ownershipDomainErrorToApplicationError(addOwnerResult.error),
      );
    }

    const newOwnerId = addOwnerResult.data;

    const persistResult = await this._ownershipRepository.addOwner(
      ownership,
      newOwnerId,
    );

    if (!persistResult.success) {
      const { message } = persistResult.error;
      return Result.fail(applicationError.unexpected(message));
    }

    return Result.ok(this._ownershipMapper.domainToDto(ownership));
  }
}
