import type { OwnershipDto } from '@/car/ownership/application/dto/ownership';
import type { AddOwnerApiRequest } from '@/car/ownership/interface/api/add.schema';
import type { PromotePrimaryOwnerApiRequest } from '@/car/ownership/interface/api/promote.schema';
import type { RemoveOwnerApiRequest } from '@/car/ownership/interface/api/remove.schema';
import type { ApiResponseError } from '@/common/application/api-response';
import type { Result } from '@/common/application/result';

/** The requester forwards the api error envelope unchanged. */
type OwnershipApiClientError = ApiResponseError;

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
