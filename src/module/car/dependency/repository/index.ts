import { carMapper } from '@/car/dependency/mapper';
import { CarRepositoryImplementation } from '@/car/infrastructure/repository/car';
import { adminDatabaseClient } from '@/dependency/database-client/admin';

export const carRepository = new CarRepositoryImplementation(
  adminDatabaseClient,
  carMapper,
);
