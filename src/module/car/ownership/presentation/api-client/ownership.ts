import type { OwnershipDto } from '@/car/ownership/application/dto/ownership';
import type { AddOwnerApiRequest } from '@/car/ownership/interface/api/add.schema';
import type { PromotePrimaryOwnerApiRequest } from '@/car/ownership/interface/api/promote.schema';
import type { RemoveOwnerApiRequest } from '@/car/ownership/interface/api/remove.schema';
import type { Result } from '@/common/application/result';
import type { ValidatorIssue } from '@/common/application/validator';

type OwnershipApiClientError = {
  message: string;
  issues?: ValidatorIssue[];
};

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
