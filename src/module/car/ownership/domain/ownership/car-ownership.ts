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

  /**
   * Removes an owner and returns the removed id. The target id is validated
   * first, then the acting owner's relationship to it is judged: a co-owner may
   * remove only themselves (leaving the car); the primary owner may remove
   * co-owners but cannot leave without first handing primary ownership to
   * someone else. Validating before authorizing is the reverse of `addOwner`,
   * because here the permission check is relative to the target and cannot be
   * answered until the target id is known.
   */
  removeOwner(
    actingId: string,
    targetId: string,
  ): Result<OwnerId, OwnershipDomainError> {
    const targetIdResult = OwnerId.create(targetId);

    if (!targetIdResult.success) {
      const { message, issues } = targetIdResult.error;
      return Result.fail({ kind: 'validation', message, issues });
    }

    const target = targetIdResult.data;

    const isActingPrimary = actingId === this._value.primaryOwner.value;
    const isTargetPrimary = target.value === this._value.primaryOwner.value;
    const isActingCoOwner = this._value.coOwners.some(
      (coOwner) => coOwner.value === actingId,
    );

    if (isActingPrimary) {
      if (isTargetPrimary) {
        return Result.fail({
          kind: 'unauthorized',
          message: 'The primary owner cannot leave without promoting first.',
        });
      }

      const isTargetCoOwner = this._value.coOwners.some(
        (coOwner) => coOwner.value === target.value,
      );

      if (!isTargetCoOwner) {
        return Result.fail({
          kind: 'conflict',
          message: 'This user is not an owner of this car.',
        });
      }
    } else if (isActingCoOwner) {
      if (target.value !== actingId) {
        return Result.fail({
          kind: 'unauthorized',
          message: 'A co-owner may remove only their own ownership.',
        });
      }
    } else {
      return Result.fail({
        kind: 'unauthorized',
        message: 'Only an owner of this car may remove an owner.',
      });
    }

    this._value.coOwners = this._value.coOwners.filter(
      (coOwner) => coOwner.value !== target.value,
    );

    return Result.ok(target);
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
