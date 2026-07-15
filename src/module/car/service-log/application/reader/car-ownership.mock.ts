import { jest } from '@jest/globals';

import type { CarOwnershipReader } from '@/car/service-log/application/reader/car-ownership';

export function createMockCarOwnershipReader(): jest.Mocked<CarOwnershipReader> {
  return {
    getByCarId: jest.fn<CarOwnershipReader['getByCarId']>(),
  };
}
