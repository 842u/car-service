import { AddOwnerUseCase } from '@/car/ownership/application/use-case/add-owner';
import { PromotePrimaryOwnerUseCase } from '@/car/ownership/application/use-case/promote-primary-owner';
import { RemoveOwnerUseCase } from '@/car/ownership/application/use-case/remove-owner';
import { ownershipMapper } from '@/car/ownership/dependency/mapper';
import { createOwnershipRepository } from '@/car/ownership/dependency/repository';
import { createOwnershipVisibility } from '@/car/ownership/dependency/service';
import { createServerAuthClient } from '@/dependency/auth-client/server';

export async function createAddOwnerUseCase() {
  const authClient = await createServerAuthClient();
  const ownershipVisibility = await createOwnershipVisibility();
  const ownershipRepository = await createOwnershipRepository();
  return new AddOwnerUseCase(
    authClient,
    ownershipVisibility,
    ownershipRepository,
    ownershipMapper,
  );
}

export async function createRemoveOwnerUseCase() {
  const authClient = await createServerAuthClient();
  const ownershipVisibility = await createOwnershipVisibility();
  const ownershipRepository = await createOwnershipRepository();
  return new RemoveOwnerUseCase(
    authClient,
    ownershipVisibility,
    ownershipRepository,
  );
}

export async function createPromotePrimaryOwnerUseCase() {
  const authClient = await createServerAuthClient();
  const ownershipVisibility = await createOwnershipVisibility();
  const ownershipRepository = await createOwnershipRepository();
  return new PromotePrimaryOwnerUseCase(
    authClient,
    ownershipVisibility,
    ownershipRepository,
    ownershipMapper,
  );
}
