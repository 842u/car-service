import { jest } from '@jest/globals';

import type { ServiceLogRepository } from '@/car/service-log/application/repository/service-log';

export function createMockServiceLogRepository(): jest.Mocked<ServiceLogRepository> {
  return {
    store: jest.fn<ServiceLogRepository['store']>(),
    getById: jest.fn<ServiceLogRepository['getById']>(),
    update: jest.fn<ServiceLogRepository['update']>(),
    remove: jest.fn<ServiceLogRepository['remove']>(),
  };
}
