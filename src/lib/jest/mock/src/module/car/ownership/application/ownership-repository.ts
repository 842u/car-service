import type { OwnershipRepository } from '@/car/ownership/application/repository/ownership';

export function createMockOwnershipRepository() {
  return {
    getByCarId: jest.fn(),
    addOwner: jest.fn(),
  } as unknown as jest.Mocked<OwnershipRepository>;
}
