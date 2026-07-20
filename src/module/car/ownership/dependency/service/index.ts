import { OwnershipVisibilityService } from '@/car/ownership/application/service/visibility';
import { createOwnershipRepository } from '@/car/ownership/dependency/repository';

export async function createOwnershipVisibility() {
  const ownershipRepository = await createOwnershipRepository();
  return new OwnershipVisibilityService(ownershipRepository);
}
