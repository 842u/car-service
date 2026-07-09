import { carMapper } from '@/car/dependency/mapper';
import { CarRepositoryImplementation } from '@/car/infrastructure/repository/car';
import { createServerDatabaseClient } from '@/dependency/database-client/server';

export async function createCarRepository() {
  const dbClient = await createServerDatabaseClient();
  return new CarRepositoryImplementation(dbClient, carMapper);
}
