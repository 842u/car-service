import { OwnershipVisibilityService } from '@/car/ownership/application/service/visibility';
import { ownershipRepository } from '@/car/ownership/dependency/repository';

export const ownershipVisibility = new OwnershipVisibilityService(
  ownershipRepository,
);
