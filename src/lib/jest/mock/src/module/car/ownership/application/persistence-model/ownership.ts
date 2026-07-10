import type { OwnershipPersistence } from '@/car/ownership/application/persistence-model/ownership';

export function createMockOwnershipPersistence(
  overrides?: Partial<OwnershipPersistence>,
): OwnershipPersistence {
  return {
    car_id: '5202140b-aa28-4058-9191-e4a117e15353',
    owner_id: 'b5b55395-e32f-4376-be03-f66be0a63ec4',
    is_primary_owner: false,
    created_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}
