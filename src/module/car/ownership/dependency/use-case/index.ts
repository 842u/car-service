import { AddOwnerUseCase } from '@/car/ownership/application/use-case/add-owner';
import { ownershipMapper } from '@/car/ownership/dependency/mapper';
import { createOwnershipRepository } from '@/car/ownership/dependency/repository';
import { createServerAuthClient } from '@/dependency/auth-client/server';

export async function createAddOwnerUseCase() {
  const authClient = await createServerAuthClient();
  const ownershipRepository = await createOwnershipRepository();
  return new AddOwnerUseCase(authClient, ownershipRepository, ownershipMapper);
}
