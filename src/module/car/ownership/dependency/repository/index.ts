import { ownershipMapper } from '@/car/ownership/dependency/mapper';
import { OwnershipRepositoryImplementation } from '@/car/ownership/infrastructure/repository/ownership';
import { adminDatabaseClient } from '@/dependency/database-client/admin';

export const ownershipRepository = new OwnershipRepositoryImplementation(
  adminDatabaseClient,
  ownershipMapper,
);
