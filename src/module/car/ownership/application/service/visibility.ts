import type { OwnershipRepository } from '@/car/ownership/application/repository/ownership';
import type { Ownership } from '@/car/ownership/domain/ownership/ownership';
import {
  type ApplicationError,
  applicationError,
} from '@/common/application/error';
import { Result } from '@/common/application/result';

/**
 * Whether `actingId` may learn that the car `carId` names exists at all. An
 * absent Ownership and a non-owner actor answer identically: masking must not
 * distinguish "does not exist" from "hidden from you". A repository read that
 * fails outright is not masked: it answers `unexpected` regardless of the
 * acting actor, since the failure carries no information about the requested
 * car specifically.
 */
export interface OwnershipVisibility {
  resolve(
    carId: string,
    actingId: string,
  ): Promise<Result<Ownership, ApplicationError>>;
}

export class OwnershipVisibilityService implements OwnershipVisibility {
  private readonly _ownershipRepository: OwnershipRepository;

  constructor(ownershipRepository: OwnershipRepository) {
    this._ownershipRepository = ownershipRepository;
  }

  async resolve(carId: string, actingId: string) {
    const getOwnershipResult =
      await this._ownershipRepository.getByCarId(carId);

    if (!getOwnershipResult.success) {
      return Result.fail(
        applicationError.unexpected(getOwnershipResult.error.message),
      );
    }

    const ownership = getOwnershipResult.data;

    if (ownership === null || !ownership.isOwner(actingId)) {
      return Result.fail(applicationError.notFound('Car not found.'));
    }

    return Result.ok(ownership);
  }
}
