import { AddCarUseCase } from '@/car/application/use-case/add';
import { EditCarUseCase } from '@/car/application/use-case/edit';
import { RemoveCarUseCase } from '@/car/application/use-case/remove';
import { carMapper } from '@/car/dependency/mapper';
import { createCarRepository } from '@/car/dependency/repository';
import { createServerAuthClient } from '@/dependency/auth-client/server';

export async function createAddCarUseCase() {
  const authClient = await createServerAuthClient();
  const carRepository = await createCarRepository();
  return new AddCarUseCase(authClient, carRepository, carMapper);
}

export async function createEditCarUseCase() {
  const authClient = await createServerAuthClient();
  const carRepository = await createCarRepository();
  return new EditCarUseCase(authClient, carRepository, carMapper);
}

export async function createRemoveCarUseCase() {
  const authClient = await createServerAuthClient();
  const carRepository = await createCarRepository();
  return new RemoveCarUseCase(authClient, carRepository);
}
