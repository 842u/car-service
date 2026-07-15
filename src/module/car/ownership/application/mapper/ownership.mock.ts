import { jest } from '@jest/globals';

import type { OwnershipMapper } from '@/car/ownership/application/mapper/ownership';

export function createMockOwnershipMapper(): jest.Mocked<OwnershipMapper> {
  return {
    domainToDto: jest.fn<OwnershipMapper['domainToDto']>(),
    persistenceToDomain: jest.fn<OwnershipMapper['persistenceToDomain']>(),
    persistenceToDto: jest.fn<OwnershipMapper['persistenceToDto']>(),
    newCoOwnerToPersistence:
      jest.fn<OwnershipMapper['newCoOwnerToPersistence']>(),
    primaryOwnerToPersistence:
      jest.fn<OwnershipMapper['primaryOwnerToPersistence']>(),
  };
}
