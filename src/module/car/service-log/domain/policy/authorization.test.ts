import { CarId } from '@/car/domain/car/value-object/car-id/car-id';
import { Ownership } from '@/car/ownership/domain/ownership/ownership';
import { OwnerId } from '@/car/ownership/domain/ownership/value-object/owner-id/owner-id';
import {
  canModify,
  canRecord,
} from '@/car/service-log/domain/policy/authorization';
import { ServiceLog } from '@/car/service-log/domain/service-log/service-log';

const CAR_ID = '11111111-1111-4111-8111-111111111111';
const PRIMARY_OWNER_ID = '22222222-2222-4222-8222-222222222222';
const CO_OWNER_ID = '33333333-3333-4333-8333-333333333333';
const NON_OWNER_ID = '44444444-4444-4444-8444-444444444444';
const AUTHOR_ID = CO_OWNER_ID;
const SERVICE_LOG_ID = '55555555-5555-4555-8555-555555555555';

function buildServiceLog(authorId: string = AUTHOR_ID): ServiceLog {
  const result = ServiceLog.create({
    id: SERVICE_LOG_ID,
    carId: CAR_ID,
    authorId,
    serviceDate: '2026-07-08',
    categories: ['engine'],
  });

  if (!result.success) {
    throw new Error('Failed to build test fixture.');
  }

  return result.data;
}

function buildOwnership(): Ownership {
  const carIdResult = CarId.create(CAR_ID);
  const primaryOwnerIdResult = OwnerId.create(PRIMARY_OWNER_ID);

  if (!carIdResult.success || !primaryOwnerIdResult.success) {
    throw new Error('Failed to build test fixture.');
  }

  const result = Ownership.create({
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
    const ownership = buildOwnership();

    expect(canRecord(ownership, PRIMARY_OWNER_ID)).toBe(true);
  });

  it('allows a co-owner', () => {
    const ownership = buildOwnership();
    ownership.addOwner(PRIMARY_OWNER_ID, CO_OWNER_ID);

    expect(canRecord(ownership, CO_OWNER_ID)).toBe(true);
  });

  it('rejects a non-owner', () => {
    const ownership = buildOwnership();

    expect(canRecord(ownership, NON_OWNER_ID)).toBe(false);
  });
});

describe('canModify', () => {
  it('allows the author, even when not the primary owner', () => {
    const ownership = buildOwnership();
    ownership.addOwner(PRIMARY_OWNER_ID, AUTHOR_ID);
    const serviceLog = buildServiceLog(AUTHOR_ID);

    expect(canModify(serviceLog, ownership, AUTHOR_ID)).toBe(true);
  });

  it('allows the primary owner, even when not the author', () => {
    const ownership = buildOwnership();
    ownership.addOwner(PRIMARY_OWNER_ID, AUTHOR_ID);
    const serviceLog = buildServiceLog(AUTHOR_ID);

    expect(canModify(serviceLog, ownership, PRIMARY_OWNER_ID)).toBe(true);
  });

  it('rejects a co-owner who is neither the author nor the primary owner', () => {
    const ownership = buildOwnership();
    ownership.addOwner(PRIMARY_OWNER_ID, AUTHOR_ID);
    ownership.addOwner(PRIMARY_OWNER_ID, NON_OWNER_ID);
    const serviceLog = buildServiceLog(AUTHOR_ID);

    expect(canModify(serviceLog, ownership, NON_OWNER_ID)).toBe(false);
  });

  it('rejects a non-owner', () => {
    const ownership = buildOwnership();
    const serviceLog = buildServiceLog(AUTHOR_ID);

    expect(canModify(serviceLog, ownership, NON_OWNER_ID)).toBe(false);
  });
});
