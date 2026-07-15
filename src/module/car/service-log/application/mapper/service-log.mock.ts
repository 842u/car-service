import { jest } from '@jest/globals';

import type { ServiceLogMapper } from '@/car/service-log/application/mapper/service-log';

export function createMockServiceLogMapper(): jest.Mocked<ServiceLogMapper> {
  return {
    domainToDto: jest.fn<ServiceLogMapper['domainToDto']>(),
    domainToPersistence: jest.fn<ServiceLogMapper['domainToPersistence']>(),
    persistenceToDomain: jest.fn<ServiceLogMapper['persistenceToDomain']>(),
    persistenceToDto: jest.fn<ServiceLogMapper['persistenceToDto']>(),
  };
}
