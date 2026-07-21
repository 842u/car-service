import {
  canChangeImage,
  canEdit,
  canRemove,
} from '@/car/domain/policy/authorization';
import { buildOwnership } from '@/car/ownership/domain/ownership/ownership.builder';

const PRIMARY_OWNER_ID = 'b5b55395-e32f-4376-be03-f66be0a63ec4';
const CO_OWNER_ID = '5202140b-aa28-4058-9191-e4a117e15353';
const NON_OWNER_ID = '9c3f6f8a-1e2b-4c3d-9f4e-5a6b7c8d9e0f';
const CAR_ID = '6a6e49f5-9711-4a95-9fc2-3e14d0b5a4e6';

describe.each([
  ['canEdit', canEdit],
  ['canRemove', canRemove],
  ['canChangeImage', canChangeImage],
])('%s', (_name, policy) => {
  it('allows the primary owner', () => {
    const ownership = buildOwnership({
      carId: CAR_ID,
      primaryOwnerId: PRIMARY_OWNER_ID,
      coOwnerIds: [CO_OWNER_ID],
    });

    expect(policy(ownership, PRIMARY_OWNER_ID)).toBe(true);
  });

  it('rejects a co-owner', () => {
    const ownership = buildOwnership({
      carId: CAR_ID,
      primaryOwnerId: PRIMARY_OWNER_ID,
      coOwnerIds: [CO_OWNER_ID],
    });

    expect(policy(ownership, CO_OWNER_ID)).toBe(false);
  });

  it('rejects a non-owner', () => {
    const ownership = buildOwnership({
      carId: CAR_ID,
      primaryOwnerId: PRIMARY_OWNER_ID,
      coOwnerIds: [CO_OWNER_ID],
    });

    expect(policy(ownership, NON_OWNER_ID)).toBe(false);
  });
});
