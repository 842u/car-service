import { AddCarUseCase } from '@/car/application/use-case/add';
import { EditCarUseCase } from '@/car/application/use-case/edit';
import { CarImageChangeUseCase } from '@/car/application/use-case/image-change';
import { RemoveCarUseCase } from '@/car/application/use-case/remove';
import { carMapper } from '@/car/dependency/mapper';
import { carProvisioning } from '@/car/dependency/provisioning';
import { carRepository } from '@/car/dependency/repository';
import { ownershipVisibility } from '@/car/ownership/dependency/service';
import { createServerAuthClient } from '@/dependency/auth-client/server';

export async function createAddCarUseCase() {
  const authClient = await createServerAuthClient();
  return new AddCarUseCase(authClient, carProvisioning, carMapper);
}

export async function createEditCarUseCase() {
  const authClient = await createServerAuthClient();
  return new EditCarUseCase(
    authClient,
    ownershipVisibility,
    carRepository,
    carMapper,
  );
}

export async function createRemoveCarUseCase() {
  const authClient = await createServerAuthClient();
  return new RemoveCarUseCase(authClient, ownershipVisibility, carRepository);
}

export async function createCarImageChangeUseCase() {
  const authClient = await createServerAuthClient();
  return new CarImageChangeUseCase(
    authClient,
    ownershipVisibility,
    carRepository,
    carMapper,
  );
}
