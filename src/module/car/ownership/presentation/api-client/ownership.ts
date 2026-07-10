import type { OwnershipDto } from '@/car/ownership/application/dto/ownership';
import type { AddOwnerApiRequest } from '@/car/ownership/interface/api/add.schema';
import type { PromotePrimaryOwnerApiRequest } from '@/car/ownership/interface/api/promote.schema';
import type { RemoveOwnerApiRequest } from '@/car/ownership/interface/api/remove.schema';
import type { Result } from '@/common/application/result';

type OwnershipApiClientError = { message: string };

export interface OwnershipApiClient {
  add(
    contract: AddOwnerApiRequest,
  ): Promise<Result<OwnershipDto[], OwnershipApiClientError>>;
  remove(
    contract: RemoveOwnerApiRequest,
  ): Promise<Result<null, OwnershipApiClientError>>;
  promote(
    contract: PromotePrimaryOwnerApiRequest,
  ): Promise<Result<OwnershipDto[], OwnershipApiClientError>>;
}
