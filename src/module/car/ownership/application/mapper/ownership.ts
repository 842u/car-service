import { CarId } from '@/car/domain/car/value-object/car-id/car-id';
import type { OwnershipDto } from '@/car/ownership/application/dto/ownership';
import type {
  OwnershipInsertPersistence,
  OwnershipPersistence,
} from '@/car/ownership/application/persistence-model/ownership';
import { CarOwnership } from '@/car/ownership/domain/ownership/car-ownership';
import { OwnerId } from '@/car/ownership/domain/ownership/value-object/owner-id/owner-id';
import type { CollectionMapper } from '@/common/application/collection-mapper';
import { Result } from '@/common/application/result';
import { ValidatorError } from '@/common/application/validator';

export class OwnershipMapper implements CollectionMapper<
  CarOwnership,
  OwnershipDto,
  OwnershipPersistence
> {
  persistenceToDto(row: OwnershipPersistence): OwnershipDto {
    return {
      carId: row.car_id,
      ownerId: row.owner_id,
      isPrimary: row.is_primary_owner,
      createdAt: row.created_at,
    };
  }

  persistenceToDomain(
    rows: OwnershipPersistence[],
  ): Result<CarOwnership, ValidatorError> {
    if (rows.length === 0) {
      return Result.fail(
        new ValidatorError('Cannot reconstitute ownership from no rows.'),
      );
    }

    const primaryRows = rows.filter((row) => row.is_primary_owner);

    if (primaryRows.length !== 1) {
      return Result.fail(
        new ValidatorError('Expected exactly one primary owner row.'),
      );
    }

    const [primaryRow] = primaryRows;
    const coOwnerRows = rows.filter((row) => !row.is_primary_owner);

    const carIdResult = CarId.create(primaryRow.car_id);

    if (!carIdResult.success) {
      return Result.fail(carIdResult.error);
    }

    const primaryOwnerResult = OwnerId.create(primaryRow.owner_id);

    if (!primaryOwnerResult.success) {
      return Result.fail(primaryOwnerResult.error);
    }

    const coOwners: OwnerId[] = [];

    for (const row of coOwnerRows) {
      const coOwnerResult = OwnerId.create(row.owner_id);

      if (!coOwnerResult.success) {
        return Result.fail(coOwnerResult.error);
      }

      coOwners.push(coOwnerResult.data);
    }

    return Result.ok(
      CarOwnership.reconstitute({
        id: carIdResult.data,
        primaryOwner: primaryOwnerResult.data,
        coOwners,
      }),
    );
  }

  domainToDto(model: CarOwnership): OwnershipDto[] {
    const carId = model.id.value;

    return [
      {
        carId,
        ownerId: model.primaryOwner.value,
        isPrimary: true,
        createdAt: null,
      },
      ...model.coOwners.map((coOwner) => ({
        carId,
        ownerId: coOwner.value,
        isPrimary: false,
        createdAt: null,
      })),
    ];
  }

  /**
   * Builds the single-row insert payload for a newly added co-owner. Kept off
   * the `CollectionMapper` interface: Ownership has no whole-aggregate
   * persistence representation (writes are per-transition), this only ever
   * produces one row for one transition.
   */
  newCoOwnerToPersistence(
    carId: CarId,
    ownerId: OwnerId,
  ): OwnershipInsertPersistence {
    return {
      car_id: carId.value,
      owner_id: ownerId.value,
      is_primary_owner: false,
    };
  }
}
