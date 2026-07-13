import { serviceLogMapper } from '@/car/service-log/dependency/mapper';
import { ServiceLogDataSourceImplementation } from '@/car/service-log/infrastructure/data-source/service-log';
import { browserDatabaseClient } from '@/dependency/database-client/browser';

export const serviceLogDataSource = new ServiceLogDataSourceImplementation(
  browserDatabaseClient,
  serviceLogMapper,
);
