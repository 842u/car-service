import { createOwnershipRepository } from '@/car/ownership/dependency/repository';
import { OwnershipReaderImplementation } from '@/car/service-log/infrastructure/reader/ownership';

export async function createOwnershipReader() {
  const ownershipRepository = await createOwnershipRepository();
  return new OwnershipReaderImplementation(ownershipRepository);
}
