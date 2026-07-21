import { carMapper } from '@/car/dependency/mapper';
import { CarProvisioningImplementation } from '@/car/infrastructure/provisioning/car';
import { ownershipMapper } from '@/car/ownership/dependency/mapper';
import { adminDatabaseClient } from '@/dependency/database-client/admin';

export const carProvisioning = new CarProvisioningImplementation(
  adminDatabaseClient,
  carMapper,
  ownershipMapper,
);
