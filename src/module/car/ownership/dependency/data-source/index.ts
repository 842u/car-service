import { ownershipMapper } from '@/car/ownership/dependency/mapper';
import { OwnershipDataSourceImplementation } from '@/car/ownership/infrastructure/data-source/ownership';
import { browserDatabaseClient } from '@/dependency/database-client/browser';

export const ownershipDataSource = new OwnershipDataSourceImplementation(
  browserDatabaseClient,
  ownershipMapper,
);
