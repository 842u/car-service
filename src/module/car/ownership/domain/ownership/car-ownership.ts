import type { CarId } from '@/car/domain/car/value-object/car-id/car-id';
import { OwnerId } from '@/car/ownership/domain/ownership/value-object/owner-id/owner-id';
import { Result } from '@/common/application/result';
import type { ValidatorIssue } from '@/common/application/validator';
import { Entity } from '@/common/domain/entity';

type CarOwnershipValue = {
  id: CarId;
  primaryOwner: OwnerId;
  coOwners: OwnerId[];
};

export type OwnershipDomainError =
  | { kind: 'validation'; message: string; issues: ValidatorIssue[] }
  | { kind: 'unauthorized'; message: string }
  | { kind: 'conflict'; message: string };

export class CarOwnership extends Entity<CarOwnershipValue> {
  private constructor(value: CarOwnershipValue) {
    super(value);
  }

  /**
   * Rebuilds an already-existing Ownership from persisted, pre-validated
   * owners. There is no `create`: Ownership is born by the car-insert
   * trigger, never originated from the application.
   */
  static reconstitute(value: CarOwnershipValue): CarOwnership {
    return new CarOwnership(value);
  }

  /**
   * Only the primary owner may add a co-owner. Authorization is checked here
   * rather than by the caller so the rule cannot be bypassed by a future call
   * site: this is the one place that knows who is currently primary.
   */
  addOwner(
    actingId: string,
    newOwnerId: string,
  ): Result<OwnerId, OwnershipDomainError> {
    if (actingId !== this._value.primaryOwner.value) {
      return Result.fail({
        kind: 'unauthorized',
        message: 'Only the primary owner may add a co-owner.',
      });
    }

    const newOwnerIdResult = OwnerId.create(newOwnerId);

    if (!newOwnerIdResult.success) {
      const { message, issues } = newOwnerIdResult.error;
      return Result.fail({ kind: 'validation', message, issues });
    }

    const ownerId = newOwnerIdResult.data;

    const isAlreadyOwner =
      this._value.primaryOwner.value === ownerId.value ||
      this._value.coOwners.some((coOwner) => coOwner.value === ownerId.value);

    if (isAlreadyOwner) {
      return Result.fail({
        kind: 'conflict',
        message: 'This user is already an owner of this car.',
      });
    }

    this._value.coOwners.push(ownerId);

    return Result.ok(ownerId);
  }

  get id(): CarId {
    return this._value.id;
  }

  get primaryOwner(): OwnerId {
    return this._value.primaryOwner;
  }

  get coOwners(): OwnerId[] {
    return this._value.coOwners;
  }
}
