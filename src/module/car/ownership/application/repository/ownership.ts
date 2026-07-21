import type { Ownership } from '@/car/ownership/domain/ownership/ownership';
import type { OwnerId } from '@/car/ownership/domain/ownership/value-object/owner-id/owner-id';
import type { RepositoryResult } from '@/common/application/repository';

/**
 * Read/update-only: Ownership is born by the car-insert trigger, so there is
 * no `store`. Unlike `CarRepository`, this does not extend the shared
 * `Repository<T>`, which mandates `store`/`update`/`remove`.
 */
export interface OwnershipRepository {
  getByCarId(carId: string): Promise<RepositoryResult<Ownership | null>>;
  addOwner(
    ownership: Ownership,
    newOwnerId: OwnerId,
  ): Promise<RepositoryResult<null>>;
  removeOwner(
    ownership: Ownership,
    targetId: OwnerId,
  ): Promise<RepositoryResult<null>>;
  promotePrimary(
    ownership: Ownership,
    newPrimaryOwnerId: OwnerId,
  ): Promise<RepositoryResult<null>>;
}
