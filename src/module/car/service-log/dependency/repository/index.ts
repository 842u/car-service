import { serviceLogMapper } from '@/car/service-log/dependency/mapper';
import { ServiceLogRepositoryImplementation } from '@/car/service-log/infrastructure/repository/service-log';
import { createServerDatabaseClient } from '@/dependency/database-client/server';

export async function createServiceLogRepository() {
  const dbClient = await createServerDatabaseClient();
  return new ServiceLogRepositoryImplementation(dbClient, serviceLogMapper);
}
