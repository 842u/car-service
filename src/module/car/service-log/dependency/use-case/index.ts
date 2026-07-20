import { ownershipVisibility } from '@/car/ownership/dependency/service';
import { AddServiceLogUseCase } from '@/car/service-log/application/use-case/add-service-log';
import { EditServiceLogUseCase } from '@/car/service-log/application/use-case/edit-service-log';
import { RemoveServiceLogUseCase } from '@/car/service-log/application/use-case/remove-service-log';
import { serviceLogMapper } from '@/car/service-log/dependency/mapper';
import { serviceLogRepository } from '@/car/service-log/dependency/repository';
import { createServerAuthClient } from '@/dependency/auth-client/server';

export async function createAddServiceLogUseCase() {
  const authClient = await createServerAuthClient();
  return new AddServiceLogUseCase(
    authClient,
    ownershipVisibility,
    serviceLogRepository,
    serviceLogMapper,
  );
}

export async function createEditServiceLogUseCase() {
  const authClient = await createServerAuthClient();
  return new EditServiceLogUseCase(
    authClient,
    ownershipVisibility,
    serviceLogRepository,
    serviceLogMapper,
  );
}

export async function createRemoveServiceLogUseCase() {
  const authClient = await createServerAuthClient();
  return new RemoveServiceLogUseCase(
    authClient,
    ownershipVisibility,
    serviceLogRepository,
  );
}
