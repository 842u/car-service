import { jest } from '@jest/globals';

import type { CarMapper } from '@/car/application/mapper/car';

export function createMockCarMapper(): jest.Mocked<CarMapper> {
  return {
    domainToDto: jest.fn<CarMapper['domainToDto']>(),
    domainToPersistence: jest.fn<CarMapper['domainToPersistence']>(),
    persistenceToDomain: jest.fn<CarMapper['persistenceToDomain']>(),
    persistenceToDto: jest.fn<CarMapper['persistenceToDto']>(),
  };
}
