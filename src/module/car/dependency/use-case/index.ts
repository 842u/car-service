import { AddCarUseCase } from '@/car/application/use-case/add';
import { EditCarUseCase } from '@/car/application/use-case/edit';
import { CarImageChangeUseCase } from '@/car/application/use-case/image-change';
import { RemoveCarUseCase } from '@/car/application/use-case/remove';
import { carMapper } from '@/car/dependency/mapper';
import { createCarProvisioning } from '@/car/dependency/provisioning';
import { createCarRepository } from '@/car/dependency/repository';
import { createOwnershipVisibility } from '@/car/ownership/dependency/service';
import { createServerAuthClient } from '@/dependency/auth-client/server';

export async function createAddCarUseCase() {
  const authClient = await createServerAuthClient();
  const carProvisioning = await createCarProvisioning();
  return new AddCarUseCase(authClient, carProvisioning, carMapper);
}

export async function createEditCarUseCase() {
  const authClient = await createServerAuthClient();
  const ownershipVisibility = await createOwnershipVisibility();
  const carRepository = await createCarRepository();
  return new EditCarUseCase(
    authClient,
    ownershipVisibility,
    carRepository,
    carMapper,
  );
}

export async function createRemoveCarUseCase() {
  const authClient = await createServerAuthClient();
  const ownershipVisibility = await createOwnershipVisibility();
  const carRepository = await createCarRepository();
  return new RemoveCarUseCase(authClient, ownershipVisibility, carRepository);
}

export async function createCarImageChangeUseCase() {
  const authClient = await createServerAuthClient();
  const ownershipVisibility = await createOwnershipVisibility();
  const carRepository = await createCarRepository();
  return new CarImageChangeUseCase(
    authClient,
    ownershipVisibility,
    carRepository,
    carMapper,
  );
}
