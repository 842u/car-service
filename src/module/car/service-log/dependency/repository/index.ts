import { serviceLogMapper } from '@/car/service-log/dependency/mapper';
import { ServiceLogRepositoryImplementation } from '@/car/service-log/infrastructure/repository/service-log';
import { adminDatabaseClient } from '@/dependency/database-client/admin';

export const serviceLogRepository = new ServiceLogRepositoryImplementation(
  adminDatabaseClient,
  serviceLogMapper,
);
