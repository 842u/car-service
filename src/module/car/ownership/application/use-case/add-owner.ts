import type { OwnershipDto } from '@/car/ownership/application/dto/ownership';
import type { OwnershipMapper } from '@/car/ownership/application/mapper/ownership';
import type { OwnershipRepository } from '@/car/ownership/application/repository/ownership';
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
  private readonly _ownershipRepository: OwnershipRepository;
  private readonly _ownershipMapper: OwnershipMapper;

  constructor(
    authClient: AuthClient,
    ownershipRepository: OwnershipRepository,
    ownershipMapper: OwnershipMapper,
  ) {
    this._authClient = authClient;
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

    const getOwnershipResult =
      await this._ownershipRepository.getByCarId(carId);

    if (!getOwnershipResult.success) {
      const { message } = getOwnershipResult.error;
      return Result.fail(applicationError.notFound(message));
    }

    const carOwnership = getOwnershipResult.data;

    const addOwnerResult = carOwnership.addOwner(actingId, ownerId);

    if (!addOwnerResult.success) {
      const { kind, message } = addOwnerResult.error;

      if (kind === 'validation') {
        return Result.fail(
          applicationError.validation(message, addOwnerResult.error.issues),
        );
      }

      if (kind === 'unauthorized') {
        return Result.fail(applicationError.unauthorized(message));
      }

      return Result.fail(applicationError.conflict(message));
    }

    const newOwnerId = addOwnerResult.data;

    const persistResult = await this._ownershipRepository.addOwner(
      carOwnership,
      newOwnerId,
    );

    if (!persistResult.success) {
      const { message } = persistResult.error;
      return Result.fail(applicationError.unexpected(message));
    }

    return Result.ok(this._ownershipMapper.domainToDto(carOwnership));
  }
}
