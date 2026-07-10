import { ownershipMapper } from '@/car/ownership/dependency/mapper';
import { OwnershipRepositoryImplementation } from '@/car/ownership/infrastructure/repository/ownership';
import { createServerDatabaseClient } from '@/dependency/database-client/server';

export async function createOwnershipRepository() {
  const dbClient = await createServerDatabaseClient();
  return new OwnershipRepositoryImplementation(dbClient, ownershipMapper);
}
