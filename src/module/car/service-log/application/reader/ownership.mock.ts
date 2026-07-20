import { jest } from '@jest/globals';

import type { OwnershipReader } from '@/car/service-log/application/reader/ownership';

export function createMockOwnershipReader(): jest.Mocked<OwnershipReader> {
  return {
    getByCarId: jest.fn<OwnershipReader['getByCarId']>(),
  };
}
