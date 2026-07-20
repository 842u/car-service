import { createOwnershipVisibility } from '@/car/ownership/dependency/service';
import { AddServiceLogUseCase } from '@/car/service-log/application/use-case/add-service-log';
import { EditServiceLogUseCase } from '@/car/service-log/application/use-case/edit-service-log';
import { RemoveServiceLogUseCase } from '@/car/service-log/application/use-case/remove-service-log';
import { serviceLogMapper } from '@/car/service-log/dependency/mapper';
import { createServiceLogRepository } from '@/car/service-log/dependency/repository';
import { createServerAuthClient } from '@/dependency/auth-client/server';

export async function createAddServiceLogUseCase() {
  const authClient = await createServerAuthClient();
  const ownershipVisibility = await createOwnershipVisibility();
  const serviceLogRepository = await createServiceLogRepository();
  return new AddServiceLogUseCase(
    authClient,
    ownershipVisibility,
    serviceLogRepository,
    serviceLogMapper,
  );
}

export async function createEditServiceLogUseCase() {
  const authClient = await createServerAuthClient();
  const ownershipVisibility = await createOwnershipVisibility();
  const serviceLogRepository = await createServiceLogRepository();
  return new EditServiceLogUseCase(
    authClient,
    ownershipVisibility,
    serviceLogRepository,
    serviceLogMapper,
  );
}

export async function createRemoveServiceLogUseCase() {
  const authClient = await createServerAuthClient();
  const ownershipVisibility = await createOwnershipVisibility();
  const serviceLogRepository = await createServiceLogRepository();
  return new RemoveServiceLogUseCase(
    authClient,
    ownershipVisibility,
    serviceLogRepository,
  );
}
