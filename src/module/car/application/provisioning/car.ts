import type { Car } from '@/car/domain/car/car';
import type { Ownership } from '@/car/ownership/domain/ownership/ownership';
import type { RepositoryResult } from '@/common/application/repository';

export interface CarProvisioning {
  createWithPrimaryOwner(
    car: Car,
    primaryOwnership: Ownership,
  ): Promise<RepositoryResult<null>>;
}
