import { jest } from '@jest/globals';

import type { CarProvisioning } from '@/car/application/provisioning/car';

export function createMockCarProvisioning(): jest.Mocked<CarProvisioning> {
  return {
    createWithPrimaryOwner:
      jest.fn<CarProvisioning['createWithPrimaryOwner']>(),
  };
}
