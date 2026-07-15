import { jest } from '@jest/globals';

import type { OwnershipRepository } from '@/car/ownership/application/repository/ownership';

export function createMockOwnershipRepository(): jest.Mocked<OwnershipRepository> {
  return {
    getByCarId: jest.fn<OwnershipRepository['getByCarId']>(),
    addOwner: jest.fn<OwnershipRepository['addOwner']>(),
    removeOwner: jest.fn<OwnershipRepository['removeOwner']>(),
    promotePrimary: jest.fn<OwnershipRepository['promotePrimary']>(),
  };
}
