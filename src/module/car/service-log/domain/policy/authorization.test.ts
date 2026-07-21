import { buildOwnership } from '@/car/ownership/domain/ownership/ownership.builder';
import {
  canEdit,
  canRemove,
} from '@/car/service-log/domain/policy/authorization';
import { buildServiceLog } from '@/car/service-log/domain/service-log/service-log.builder';

const CAR_ID = '11111111-1111-4111-8111-111111111111';
const PRIMARY_OWNER_ID = '22222222-2222-4222-8222-222222222222';
const AUTHOR_ID = '33333333-3333-4333-8333-333333333333';
const NON_AUTHOR_CO_OWNER_ID = '44444444-4444-4444-8444-444444444444';
const NON_OWNER_ID = '55555555-5555-4555-8555-555555555555';
const SERVICE_LOG_ID = '66666666-6666-4666-8666-666666666666';

describe.each([
  ['canEdit', canEdit],
  ['canRemove', canRemove],
])('%s', (_name, policy) => {
  it('allows the author, even when not the primary owner', () => {
    const ownership = buildOwnership({
      carId: CAR_ID,
      primaryOwnerId: PRIMARY_OWNER_ID,
      coOwnerIds: [AUTHOR_ID],
    });
    const serviceLog = buildServiceLog({
      id: SERVICE_LOG_ID,
      carId: CAR_ID,
      authorId: AUTHOR_ID,
    });

    expect(policy(serviceLog, ownership, AUTHOR_ID)).toBe(true);
  });

  it('allows the primary owner, even when not the author', () => {
    const ownership = buildOwnership({
      carId: CAR_ID,
      primaryOwnerId: PRIMARY_OWNER_ID,
      coOwnerIds: [AUTHOR_ID],
    });
    const serviceLog = buildServiceLog({
      id: SERVICE_LOG_ID,
      carId: CAR_ID,
      authorId: AUTHOR_ID,
    });

    expect(policy(serviceLog, ownership, PRIMARY_OWNER_ID)).toBe(true);
  });

  it('rejects a co-owner who is neither the author nor the primary owner', () => {
    const ownership = buildOwnership({
      carId: CAR_ID,
      primaryOwnerId: PRIMARY_OWNER_ID,
      coOwnerIds: [AUTHOR_ID, NON_AUTHOR_CO_OWNER_ID],
    });
    const serviceLog = buildServiceLog({
      id: SERVICE_LOG_ID,
      carId: CAR_ID,
      authorId: AUTHOR_ID,
    });

    expect(policy(serviceLog, ownership, NON_AUTHOR_CO_OWNER_ID)).toBe(false);
  });

  it('rejects a non-owner', () => {
    const ownership = buildOwnership({
      carId: CAR_ID,
      primaryOwnerId: PRIMARY_OWNER_ID,
      coOwnerIds: [AUTHOR_ID],
    });
    const serviceLog = buildServiceLog({
      id: SERVICE_LOG_ID,
      carId: CAR_ID,
      authorId: AUTHOR_ID,
    });

    expect(policy(serviceLog, ownership, NON_OWNER_ID)).toBe(false);
  });
});
