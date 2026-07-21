import { jest } from '@jest/globals';

import type { OwnershipVisibility } from '@/car/ownership/application/service/visibility';

export function createMockOwnershipVisibility(): jest.Mocked<OwnershipVisibility> {
  return {
    resolve: jest.fn<OwnershipVisibility['resolve']>(),
  };
}
