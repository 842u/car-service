import { createOwnershipRepository } from '@/car/ownership/dependency/repository';
import { CarOwnershipReaderImplementation } from '@/car/service-log/infrastructure/reader/car-ownership';

export async function createCarOwnershipReader() {
  const ownershipRepository = await createOwnershipRepository();
  return new CarOwnershipReaderImplementation(ownershipRepository);
}
