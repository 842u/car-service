import { CarId } from '@/car/domain/car/value-object/car-id/car-id';
import { CarOwnership } from '@/car/ownership/domain/ownership/car-ownership';
import { OwnerId } from '@/car/ownership/domain/ownership/value-object/owner-id/owner-id';

export function createMockCarOwnership({
  carId = '5202140b-aa28-4058-9191-e4a117e15353',
  primaryOwnerId = 'b5b55395-e32f-4376-be03-f66be0a63ec4',
  coOwnerIds = [],
}: {
  carId?: string;
  primaryOwnerId?: string;
  coOwnerIds?: string[];
} = {}): CarOwnership {
  const idResult = CarId.create(carId);
  const primaryOwnerResult = OwnerId.create(primaryOwnerId);

  if (!idResult.success || !primaryOwnerResult.success) {
    throw new Error('Failed to create mock car ownership.');
  }

  const coOwners = coOwnerIds.map((value) => {
    const coOwnerResult = OwnerId.create(value);

    if (!coOwnerResult.success) {
      throw new Error('Failed to create mock car ownership.');
    }

    return coOwnerResult.data;
  });

  return CarOwnership.reconstitute({
    id: idResult.data,
    primaryOwner: primaryOwnerResult.data,
    coOwners,
  });
}
