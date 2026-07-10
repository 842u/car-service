import type { OwnershipDto } from '@/car/ownership/application/dto/ownership';
import type { AddOwnerApiRequest } from '@/car/ownership/interface/api/add.schema';
import type { Result } from '@/common/application/result';

type OwnershipApiClientError = { message: string };

export interface OwnershipApiClient {
  add(
    contract: AddOwnerApiRequest,
  ): Promise<Result<OwnershipDto[], OwnershipApiClientError>>;
}
