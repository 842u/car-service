import { carMapper } from '@/car/dependency/mapper';
import { CarProvisioningImplementation } from '@/car/infrastructure/provisioning/car';
import { ownershipMapper } from '@/car/ownership/dependency/mapper';
import { createServerDatabaseClient } from '@/dependency/database-client/server';

export async function createCarProvisioning() {
  const dbClient = await createServerDatabaseClient();
  return new CarProvisioningImplementation(
    dbClient,
    carMapper,
    ownershipMapper,
  );
}
