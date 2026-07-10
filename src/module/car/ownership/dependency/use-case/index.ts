import { AddOwnerUseCase } from '@/car/ownership/application/use-case/add-owner';
import { PromotePrimaryOwnerUseCase } from '@/car/ownership/application/use-case/promote-primary-owner';
import { RemoveOwnerUseCase } from '@/car/ownership/application/use-case/remove-owner';
import { ownershipMapper } from '@/car/ownership/dependency/mapper';
import { createOwnershipRepository } from '@/car/ownership/dependency/repository';
import { createServerAuthClient } from '@/dependency/auth-client/server';

export async function createAddOwnerUseCase() {
  const authClient = await createServerAuthClient();
  const ownershipRepository = await createOwnershipRepository();
  return new AddOwnerUseCase(authClient, ownershipRepository, ownershipMapper);
}

export async function createRemoveOwnerUseCase() {
  const authClient = await createServerAuthClient();
  const ownershipRepository = await createOwnershipRepository();
  return new RemoveOwnerUseCase(authClient, ownershipRepository);
}

export async function createPromotePrimaryOwnerUseCase() {
  const authClient = await createServerAuthClient();
  const ownershipRepository = await createOwnershipRepository();
  return new PromotePrimaryOwnerUseCase(
    authClient,
    ownershipRepository,
    ownershipMapper,
  );
}
