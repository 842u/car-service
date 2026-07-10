import type { CarId } from '@/car/domain/car/value-object/car-id/car-id';
import type { OwnerId } from '@/car/ownership/domain/ownership/value-object/owner-id/owner-id';
import { Entity } from '@/common/domain/entity';

type CarOwnershipValue = {
  id: CarId;
  primaryOwner: OwnerId;
  coOwners: OwnerId[];
};

export class CarOwnership extends Entity<CarOwnershipValue> {}
