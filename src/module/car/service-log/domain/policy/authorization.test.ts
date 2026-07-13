import { CarId } from '@/car/domain/car/value-object/car-id/car-id';
import { CarOwnership } from '@/car/ownership/domain/ownership/car-ownership';
import { OwnerId } from '@/car/ownership/domain/ownership/value-object/owner-id/owner-id';
import { canRecord } from '@/car/service-log/domain/policy/authorization';

const CAR_ID = '11111111-1111-4111-8111-111111111111';
const PRIMARY_OWNER_ID = '22222222-2222-4222-8222-222222222222';
const CO_OWNER_ID = '33333333-3333-4333-8333-333333333333';
const NON_OWNER_ID = '44444444-4444-4444-8444-444444444444';

function buildCarOwnership(): CarOwnership {
  const carIdResult = CarId.create(CAR_ID);
  const primaryOwnerIdResult = OwnerId.create(PRIMARY_OWNER_ID);

  if (!carIdResult.success || !primaryOwnerIdResult.success) {
    throw new Error('Failed to build test fixture.');
  }

  const result = CarOwnership.create({
    carId: carIdResult.data,
    primaryOwnerId: primaryOwnerIdResult.data,
  });

  if (!result.success) {
    throw new Error('Failed to build test fixture.');
  }

  return result.data;
}

describe('canRecord', () => {
  it('allows the primary owner', () => {
    const ownership = buildCarOwnership();

    expect(canRecord(ownership, PRIMARY_OWNER_ID)).toBe(true);
  });

  it('allows a co-owner', () => {
    const ownership = buildCarOwnership();
    ownership.addOwner(PRIMARY_OWNER_ID, CO_OWNER_ID);

    expect(canRecord(ownership, CO_OWNER_ID)).toBe(true);
  });

  it('rejects a non-owner', () => {
    const ownership = buildCarOwnership();

    expect(canRecord(ownership, NON_OWNER_ID)).toBe(false);
  });
});
