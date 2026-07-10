import type { OwnershipDto } from '@/car/ownership/application/dto/ownership';
import type { OwnershipPersistence } from '@/car/ownership/application/persistence-model/ownership';
import type { CarOwnership } from '@/car/ownership/domain/ownership/car-ownership';
import type { CollectionMapper } from '@/common/application/collection-mapper';
import type { Result } from '@/common/application/result';

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
    _rows: OwnershipPersistence[],
  ): Result<CarOwnership, unknown> {
    throw new Error(
      'Not implemented until the CarOwnership aggregate is built.',
    );
  }

  domainToDto(_model: CarOwnership): OwnershipDto[] {
    throw new Error(
      'Not implemented until the CarOwnership aggregate is built.',
    );
  }
}
