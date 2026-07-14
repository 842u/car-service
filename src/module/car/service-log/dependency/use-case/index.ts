import { AddServiceLogUseCase } from '@/car/service-log/application/use-case/add-service-log';
import { EditServiceLogUseCase } from '@/car/service-log/application/use-case/edit-service-log';
import { RemoveServiceLogUseCase } from '@/car/service-log/application/use-case/remove-service-log';
import { serviceLogMapper } from '@/car/service-log/dependency/mapper';
import { createCarOwnershipReader } from '@/car/service-log/dependency/reader';
import { createServiceLogRepository } from '@/car/service-log/dependency/repository';
import { createServerAuthClient } from '@/dependency/auth-client/server';

export async function createAddServiceLogUseCase() {
  const authClient = await createServerAuthClient();
  const carOwnershipReader = await createCarOwnershipReader();
  const serviceLogRepository = await createServiceLogRepository();
  return new AddServiceLogUseCase(
    authClient,
    carOwnershipReader,
    serviceLogRepository,
    serviceLogMapper,
  );
}

export async function createEditServiceLogUseCase() {
  const authClient = await createServerAuthClient();
  const carOwnershipReader = await createCarOwnershipReader();
  const serviceLogRepository = await createServiceLogRepository();
  return new EditServiceLogUseCase(
    authClient,
    carOwnershipReader,
    serviceLogRepository,
    serviceLogMapper,
  );
}

export async function createRemoveServiceLogUseCase() {
  const authClient = await createServerAuthClient();
  const carOwnershipReader = await createCarOwnershipReader();
  const serviceLogRepository = await createServiceLogRepository();
  return new RemoveServiceLogUseCase(
    authClient,
    carOwnershipReader,
    serviceLogRepository,
  );
}
