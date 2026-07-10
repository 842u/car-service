import { carMapper } from '@/car/dependency/mapper';
import { CarDataSourceImplementation } from '@/car/infrastructure/data-source/car';
import { browserDatabaseClient } from '@/dependency/database-client/browser';

export const carDataSource = new CarDataSourceImplementation(
  browserDatabaseClient,
  carMapper,
);
