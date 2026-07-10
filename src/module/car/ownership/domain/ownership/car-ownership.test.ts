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
        expect(result.error.kind).toBe('unauthorized');
      }
      expect(carOwnership.coOwners).toHaveLength(1);
    });

    it('rejects a non-primary actor before validating the new owner id', () => {
      const carOwnership = buildCarOwnership({ coOwners: [CO_OWNER_ID] });

      const result = carOwnership.addOwner(CO_OWNER_ID, 'not-a-uuid');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('unauthorized');
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
});
