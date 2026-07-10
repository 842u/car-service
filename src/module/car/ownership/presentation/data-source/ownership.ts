import type { OwnershipDto } from '@/car/ownership/application/dto/ownership';
import type { Result } from '@/common/application/result';

type OwnershipDataSourceError = {
  message: string;
};

export interface OwnershipDataSource {
  getByCarId(
    carId: string,
  ): Promise<Result<OwnershipDto[], OwnershipDataSourceError>>;
  getByOwnerId(
    ownerId: string,
  ): Promise<Result<OwnershipDto[], OwnershipDataSourceError>>;
}
