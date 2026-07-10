import type { OwnershipRepository } from '@/car/ownership/application/repository/ownership';

export function createMockOwnershipRepository() {
  return {
    getByCarId: jest.fn(),
    addOwner: jest.fn(),
    removeOwner: jest.fn(),
    promotePrimary: jest.fn(),
  } as unknown as jest.Mocked<OwnershipRepository>;
}
