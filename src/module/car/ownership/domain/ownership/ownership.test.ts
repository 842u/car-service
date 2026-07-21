import { CarId } from '@/car/domain/car/value-object/car-id/car-id';
import { Ownership } from '@/car/ownership/domain/ownership/ownership';
import { OwnerId } from '@/car/ownership/domain/ownership/value-object/owner-id/owner-id';

const CAR_ID = '11111111-1111-4111-8111-111111111111';
const PRIMARY_OWNER_ID = '22222222-2222-4222-8222-222222222222';
const CO_OWNER_ID = '33333333-3333-4333-8333-333333333333';
const NEW_OWNER_ID = '44444444-4444-4444-8444-444444444444';

function buildOwnership({
  coOwners = [],
}: { coOwners?: string[] } = {}): Ownership {
  const idResult = CarId.create(CAR_ID);
  const primaryOwnerResult = OwnerId.create(PRIMARY_OWNER_ID);

  if (!idResult.success || !primaryOwnerResult.success) {
    throw new Error('Failed to build test fixture.');
  }

  return Ownership.reconstitute({
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

describe('Ownership', () => {
  describe('create', () => {
    it('births an ownership with the given primary owner and no co-owners', () => {
      const idResult = CarId.create(CAR_ID);
      const primaryOwnerResult = OwnerId.create(PRIMARY_OWNER_ID);

      if (!idResult.success || !primaryOwnerResult.success) {
        throw new Error('Failed to build test fixture.');
      }

      const result = Ownership.create({
        carId: idResult.data,
        primaryOwnerId: primaryOwnerResult.data,
      });

      expect(result.success).toBe(true);
      if (!result.success) {
        throw new Error('Expected create to succeed.');
      }

      const ownership = result.data;

      expect(ownership.id.value).toBe(CAR_ID);
      expect(ownership.primaryOwner.value).toBe(PRIMARY_OWNER_ID);
      expect(ownership.coOwners).toHaveLength(0);
    });
  });

  describe('isOwner', () => {
    it('returns true for the primary owner', () => {
      const ownership = buildOwnership({ coOwners: [CO_OWNER_ID] });

      expect(ownership.isOwner(PRIMARY_OWNER_ID)).toBe(true);
    });

    it('returns true for a co-owner', () => {
      const ownership = buildOwnership({ coOwners: [CO_OWNER_ID] });

      expect(ownership.isOwner(CO_OWNER_ID)).toBe(true);
    });

    it('returns false for a non-owner', () => {
      const ownership = buildOwnership({ coOwners: [CO_OWNER_ID] });

      expect(ownership.isOwner(NEW_OWNER_ID)).toBe(false);
    });
  });

  describe('isPrimaryOwner', () => {
    it('returns true for the primary owner', () => {
      const ownership = buildOwnership({ coOwners: [CO_OWNER_ID] });

      expect(ownership.isPrimaryOwner(PRIMARY_OWNER_ID)).toBe(true);
    });

    it('returns false for a co-owner', () => {
      const ownership = buildOwnership({ coOwners: [CO_OWNER_ID] });

      expect(ownership.isPrimaryOwner(CO_OWNER_ID)).toBe(false);
    });

    it('returns false for a non-owner', () => {
      const ownership = buildOwnership({ coOwners: [CO_OWNER_ID] });

      expect(ownership.isPrimaryOwner(NEW_OWNER_ID)).toBe(false);
    });
  });

  describe('addOwner', () => {
    it('adds a co-owner when the actor is the primary owner', () => {
      const ownership = buildOwnership();

      const result = ownership.addOwner(PRIMARY_OWNER_ID, NEW_OWNER_ID);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.value).toBe(NEW_OWNER_ID);
      }
      expect(ownership.coOwners.map((owner) => owner.value)).toContain(
        NEW_OWNER_ID,
      );
    });

    it('rejects the add when the actor is not the primary owner', () => {
      const ownership = buildOwnership({ coOwners: [CO_OWNER_ID] });

      const result = ownership.addOwner(CO_OWNER_ID, NEW_OWNER_ID);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('forbidden');
      }
      expect(ownership.coOwners).toHaveLength(1);
    });

    it('rejects a non-primary actor before validating the new owner id', () => {
      const ownership = buildOwnership({ coOwners: [CO_OWNER_ID] });

      const result = ownership.addOwner(CO_OWNER_ID, 'not-a-uuid');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('forbidden');
      }
    });

    it('rejects a malformed new owner id', () => {
      const ownership = buildOwnership();

      const result = ownership.addOwner(PRIMARY_OWNER_ID, 'not-a-uuid');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('validation');
      }
    });

    it('rejects adding the current primary owner again', () => {
      const ownership = buildOwnership();

      const result = ownership.addOwner(PRIMARY_OWNER_ID, PRIMARY_OWNER_ID);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('conflict');
      }
    });

    it('rejects adding an existing co-owner again', () => {
      const ownership = buildOwnership({ coOwners: [CO_OWNER_ID] });

      const result = ownership.addOwner(PRIMARY_OWNER_ID, CO_OWNER_ID);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('conflict');
      }
      expect(ownership.coOwners).toHaveLength(1);
    });
  });

  describe('removeOwner', () => {
    it('removes a co-owner when the actor is the primary owner', () => {
      const ownership = buildOwnership({ coOwners: [CO_OWNER_ID] });

      const result = ownership.removeOwner(PRIMARY_OWNER_ID, CO_OWNER_ID);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.value).toBe(CO_OWNER_ID);
      }
      expect(ownership.coOwners.map((owner) => owner.value)).not.toContain(
        CO_OWNER_ID,
      );
    });

    it('removes a co-owner acting on their own ownership (leave)', () => {
      const ownership = buildOwnership({ coOwners: [CO_OWNER_ID] });

      const result = ownership.removeOwner(CO_OWNER_ID, CO_OWNER_ID);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.value).toBe(CO_OWNER_ID);
      }
      expect(ownership.coOwners).toHaveLength(0);
    });

    it('rejects the primary owner removing themselves', () => {
      const ownership = buildOwnership({ coOwners: [CO_OWNER_ID] });

      const result = ownership.removeOwner(PRIMARY_OWNER_ID, PRIMARY_OWNER_ID);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('forbidden');
      }
      expect(ownership.coOwners).toHaveLength(1);
    });

    it('rejects a co-owner removing a different owner', () => {
      const ownership = buildOwnership({
        coOwners: [CO_OWNER_ID, NEW_OWNER_ID],
      });

      const result = ownership.removeOwner(CO_OWNER_ID, NEW_OWNER_ID);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('forbidden');
      }
      expect(ownership.coOwners).toHaveLength(2);
    });

    it('rejects an actor who is not an owner of the car', () => {
      const ownership = buildOwnership({ coOwners: [CO_OWNER_ID] });

      const result = ownership.removeOwner(NEW_OWNER_ID, CO_OWNER_ID);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('forbidden');
      }
      expect(ownership.coOwners).toHaveLength(1);
    });

    it('rejects removing a target that is not an owner', () => {
      const ownership = buildOwnership({ coOwners: [CO_OWNER_ID] });

      const result = ownership.removeOwner(PRIMARY_OWNER_ID, NEW_OWNER_ID);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('conflict');
      }
      expect(ownership.coOwners).toHaveLength(1);
    });

    it('rejects a malformed target id', () => {
      const ownership = buildOwnership({ coOwners: [CO_OWNER_ID] });

      const result = ownership.removeOwner(PRIMARY_OWNER_ID, 'not-a-uuid');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('validation');
      }
    });

    it('validates the target id before judging the actor relationship', () => {
      const ownership = buildOwnership({ coOwners: [CO_OWNER_ID] });

      const result = ownership.removeOwner(CO_OWNER_ID, 'not-a-uuid');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('validation');
      }
    });
  });

  describe('promotePrimary', () => {
    it('swaps roles when the primary owner promotes a co-owner', () => {
      const ownership = buildOwnership({
        coOwners: [CO_OWNER_ID, NEW_OWNER_ID],
      });

      const result = ownership.promotePrimary(PRIMARY_OWNER_ID, CO_OWNER_ID);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.value).toBe(CO_OWNER_ID);
      }
      expect(ownership.primaryOwner.value).toBe(CO_OWNER_ID);

      const coOwnerIds = ownership.coOwners.map((owner) => owner.value);
      expect(coOwnerIds).toContain(PRIMARY_OWNER_ID);
      expect(coOwnerIds).not.toContain(CO_OWNER_ID);
      expect(coOwnerIds).toContain(NEW_OWNER_ID);
    });

    it('rejects the promotion when the actor is not the primary owner', () => {
      const ownership = buildOwnership({
        coOwners: [CO_OWNER_ID, NEW_OWNER_ID],
      });

      const result = ownership.promotePrimary(CO_OWNER_ID, NEW_OWNER_ID);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('forbidden');
      }
      expect(ownership.primaryOwner.value).toBe(PRIMARY_OWNER_ID);
    });

    it('rejects a non-primary actor before validating the target id', () => {
      const ownership = buildOwnership({ coOwners: [CO_OWNER_ID] });

      const result = ownership.promotePrimary(CO_OWNER_ID, 'not-a-uuid');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('forbidden');
      }
    });

    it('rejects a malformed target id', () => {
      const ownership = buildOwnership({ coOwners: [CO_OWNER_ID] });

      const result = ownership.promotePrimary(PRIMARY_OWNER_ID, 'not-a-uuid');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('validation');
      }
    });

    it('rejects promoting a target that is not a co-owner', () => {
      const ownership = buildOwnership({ coOwners: [CO_OWNER_ID] });

      const result = ownership.promotePrimary(PRIMARY_OWNER_ID, NEW_OWNER_ID);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('conflict');
      }
      expect(ownership.primaryOwner.value).toBe(PRIMARY_OWNER_ID);
    });

    it('rejects the primary owner promoting themselves', () => {
      const ownership = buildOwnership({ coOwners: [CO_OWNER_ID] });

      const result = ownership.promotePrimary(
        PRIMARY_OWNER_ID,
        PRIMARY_OWNER_ID,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('conflict');
      }
      expect(ownership.primaryOwner.value).toBe(PRIMARY_OWNER_ID);
    });
  });
});
