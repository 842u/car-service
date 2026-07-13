import type { Car } from '@/car/domain/car/car';
import type { CarOwnership } from '@/car/ownership/domain/ownership/car-ownership';
import type { RepositoryResult } from '@/common/application/repository';

export interface CarProvisioning {
  createWithPrimaryOwner(
    car: Car,
    primaryOwnership: CarOwnership,
  ): Promise<RepositoryResult<null>>;
}
