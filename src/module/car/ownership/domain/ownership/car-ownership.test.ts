import { CarId } from '@/car/domain/car/value-object/car-id/car-id';
import { CarOwnership } from '@/car/ownership/domain/ownership/car-ownership';
import { OwnerId } from '@/car/ownership/domain/ownership/value-object/owner-id/owner-id';

const CAR_ID = '11111111-1111-4111-8111-111111111111';
const PRIMARY_OWNER_ID = '22222222-2222-4222-8222-222222222222';
const CO_OWNER_ID = '33333333-3333-4333-8333-333333333333';
const NEW_OWNER_ID = '44444444-4444-4444-8444-444444444444';

function buildCarOwnership({
  coOwners = [],
}: { coOwners?: string[] } = {}): CarOwnership {
  const idResult = CarId.create(CAR_ID);
  const primaryOwnerResult = OwnerId.create(PRIMARY_OWNER_ID);

  if (!idResult.success || !primaryOwnerResult.success) {
    throw new Error('Failed to build test fixture.');
  }

  return CarOwnership.reconstitute({
    id: idResult.data,
    primaryOwner: primaryOwnerResult.data,
    coOwners: coOwners.map((value) => {
      const coOwnerResult = OwnerId.create(value);
      if (!coOwnerResult.success) {
        throw new Error('Failed to build test fixture.');
      }
      return coOwnerResult.data;
    }),
  });
}

describe('CarOwnership', () => {
  describe('create', () => {
    it('births an ownership with the given primary owner and no co-owners', () => {
      const idResult = CarId.create(CAR_ID);
      const primaryOwnerResult = OwnerId.create(PRIMARY_OWNER_ID);

      if (!idResult.success || !primaryOwnerResult.success) {
        throw new Error('Failed to build test fixture.');
      }

      const result = CarOwnership.create({
        carId: idResult.data,
        primaryOwnerId: primaryOwnerResult.data,
      });

      expect(result.success).toBe(true);
      if (!result.success) {
        throw new Error('Expected create to succeed.');
      }

      const carOwnership = result.data;

      expect(carOwnership.id.value).toBe(CAR_ID);
      expect(carOwnership.primaryOwner.value).toBe(PRIMARY_OWNER_ID);
      expect(carOwnership.coOwners).toHaveLength(0);
    });
  });

  describe('isOwner', () => {
    it('returns true for the primary owner', () => {
      const carOwnership = buildCarOwnership({ coOwners: [CO_OWNER_ID] });

      expect(carOwnership.isOwner(PRIMARY_OWNER_ID)).toBe(true);
    });

    it('returns true for a co-owner', () => {
      const carOwnership = buildCarOwnership({ coOwners: [CO_OWNER_ID] });

      expect(carOwnership.isOwner(CO_OWNER_ID)).toBe(true);
    });

    it('returns false for a non-owner', () => {
      const carOwnership = buildCarOwnership({ coOwners: [CO_OWNER_ID] });

      expect(carOwnership.isOwner(NEW_OWNER_ID)).toBe(false);
    });
  });

  describe('isPrimaryOwner', () => {
    it('returns true for the primary owner', () => {
      const carOwnership = buildCarOwnership({ coOwners: [CO_OWNER_ID] });

      expect(carOwnership.isPrimaryOwner(PRIMARY_OWNER_ID)).toBe(true);
    });

    it('returns false for a co-owner', () => {
      const carOwnership = buildCarOwnership({ coOwners: [CO_OWNER_ID] });

      expect(carOwnership.isPrimaryOwner(CO_OWNER_ID)).toBe(false);
    });

    it('returns false for a non-owner', () => {
      const carOwnership = buildCarOwnership({ coOwners: [CO_OWNER_ID] });

      expect(carOwnership.isPrimaryOwner(NEW_OWNER_ID)).toBe(false);
    });
  });

  describe('addOwner', () => {
    it('adds a co-owner when the actor is the primary owner', () => {
      const carOwnership = buildCarOwnership();

      const result = carOwnership.addOwner(PRIMARY_OWNER_ID, NEW_OWNER_ID);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.value).toBe(NEW_OWNER_ID);
      }
      expect(carOwnership.coOwners.map((owner) => owner.value)).toContain(
        NEW_OWNER_ID,
      );
    });

    it('rejects the add when the actor is not the primary owner', () => {
      const carOwnership = buildCarOwnership({ coOwners: [CO_OWNER_ID] });

      const result = carOwnership.addOwner(CO_OWNER_ID, NEW_OWNER_ID);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('forbidden');
      }
      expect(carOwnership.coOwners).toHaveLength(1);
    });

    it('rejects a non-primary actor before validating the new owner id', () => {
      const carOwnership = buildCarOwnership({ coOwners: [CO_OWNER_ID] });

      const result = carOwnership.addOwner(CO_OWNER_ID, 'not-a-uuid');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('forbidden');
      }
    });

    it('rejects a malformed new owner id', () => {
      const carOwnership = buildCarOwnership();

      const result = carOwnership.addOwner(PRIMARY_OWNER_ID, 'not-a-uuid');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('validation');
      }
    });

    it('rejects adding the current primary owner again', () => {
      const carOwnership = buildCarOwnership();

      const result = carOwnership.addOwner(PRIMARY_OWNER_ID, PRIMARY_OWNER_ID);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('conflict');
      }
    });

    it('rejects adding an existing co-owner again', () => {
      const carOwnership = buildCarOwnership({ coOwners: [CO_OWNER_ID] });

      const result = carOwnership.addOwner(PRIMARY_OWNER_ID, CO_OWNER_ID);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('conflict');
      }
      expect(carOwnership.coOwners).toHaveLength(1);
    });
  });

  describe('removeOwner', () => {
    it('removes a co-owner when the actor is the primary owner', () => {
      const carOwnership = buildCarOwnership({ coOwners: [CO_OWNER_ID] });

      const result = carOwnership.removeOwner(PRIMARY_OWNER_ID, CO_OWNER_ID);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.value).toBe(CO_OWNER_ID);
      }
      expect(carOwnership.coOwners.map((owner) => owner.value)).not.toContain(
        CO_OWNER_ID,
      );
    });

    it('removes a co-owner acting on their own ownership (leave)', () => {
      const carOwnership = buildCarOwnership({ coOwners: [CO_OWNER_ID] });

      const result = carOwnership.removeOwner(CO_OWNER_ID, CO_OWNER_ID);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.value).toBe(CO_OWNER_ID);
      }
      expect(carOwnership.coOwners).toHaveLength(0);
    });

    it('rejects the primary owner removing themselves', () => {
      const carOwnership = buildCarOwnership({ coOwners: [CO_OWNER_ID] });

      const result = carOwnership.removeOwner(
        PRIMARY_OWNER_ID,
        PRIMARY_OWNER_ID,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('forbidden');
      }
      expect(carOwnership.coOwners).toHaveLength(1);
    });

    it('rejects a co-owner removing a different owner', () => {
      const carOwnership = buildCarOwnership({
        coOwners: [CO_OWNER_ID, NEW_OWNER_ID],
      });

      const result = carOwnership.removeOwner(CO_OWNER_ID, NEW_OWNER_ID);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('forbidden');
      }
      expect(carOwnership.coOwners).toHaveLength(2);
    });

    it('rejects an actor who is not an owner of the car', () => {
      const carOwnership = buildCarOwnership({ coOwners: [CO_OWNER_ID] });

      const result = carOwnership.removeOwner(NEW_OWNER_ID, CO_OWNER_ID);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('forbidden');
      }
      expect(carOwnership.coOwners).toHaveLength(1);
    });

    it('rejects removing a target that is not an owner', () => {
      const carOwnership = buildCarOwnership({ coOwners: [CO_OWNER_ID] });

      const result = carOwnership.removeOwner(PRIMARY_OWNER_ID, NEW_OWNER_ID);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('conflict');
      }
      expect(carOwnership.coOwners).toHaveLength(1);
    });

    it('rejects a malformed target id', () => {
      const carOwnership = buildCarOwnership({ coOwners: [CO_OWNER_ID] });

      const result = carOwnership.removeOwner(PRIMARY_OWNER_ID, 'not-a-uuid');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('validation');
      }
    });

    it('validates the target id before judging the actor relationship', () => {
      const carOwnership = buildCarOwnership({ coOwners: [CO_OWNER_ID] });

      const result = carOwnership.removeOwner(CO_OWNER_ID, 'not-a-uuid');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('validation');
      }
    });
  });

  describe('promotePrimary', () => {
    it('swaps roles when the primary owner promotes a co-owner', () => {
      const carOwnership = buildCarOwnership({
        coOwners: [CO_OWNER_ID, NEW_OWNER_ID],
      });

      const result = carOwnership.promotePrimary(PRIMARY_OWNER_ID, CO_OWNER_ID);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.value).toBe(CO_OWNER_ID);
      }
      expect(carOwnership.primaryOwner.value).toBe(CO_OWNER_ID);

      const coOwnerIds = carOwnership.coOwners.map((owner) => owner.value);
      expect(coOwnerIds).toContain(PRIMARY_OWNER_ID);
      expect(coOwnerIds).not.toContain(CO_OWNER_ID);
      expect(coOwnerIds).toContain(NEW_OWNER_ID);
    });

    it('rejects the promotion when the actor is not the primary owner', () => {
      const carOwnership = buildCarOwnership({
        coOwners: [CO_OWNER_ID, NEW_OWNER_ID],
      });

      const result = carOwnership.promotePrimary(CO_OWNER_ID, NEW_OWNER_ID);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('forbidden');
      }
      expect(carOwnership.primaryOwner.value).toBe(PRIMARY_OWNER_ID);
    });

    it('rejects a non-primary actor before validating the target id', () => {
      const carOwnership = buildCarOwnership({ coOwners: [CO_OWNER_ID] });

      const result = carOwnership.promotePrimary(CO_OWNER_ID, 'not-a-uuid');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('forbidden');
      }
    });

    it('rejects a malformed target id', () => {
      const carOwnership = buildCarOwnership({ coOwners: [CO_OWNER_ID] });

      const result = carOwnership.promotePrimary(
        PRIMARY_OWNER_ID,
        'not-a-uuid',
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('validation');
      }
    });

    it('rejects promoting a target that is not a co-owner', () => {
      const carOwnership = buildCarOwnership({ coOwners: [CO_OWNER_ID] });

      const result = carOwnership.promotePrimary(
        PRIMARY_OWNER_ID,
        NEW_OWNER_ID,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('conflict');
      }
      expect(carOwnership.primaryOwner.value).toBe(PRIMARY_OWNER_ID);
    });

    it('rejects the primary owner promoting themselves', () => {
      const carOwnership = buildCarOwnership({ coOwners: [CO_OWNER_ID] });

      const result = carOwnership.promotePrimary(
        PRIMARY_OWNER_ID,
        PRIMARY_OWNER_ID,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('conflict');
      }
      expect(carOwnership.primaryOwner.value).toBe(PRIMARY_OWNER_ID);
    });
  });
});
