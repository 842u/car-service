import type { ServiceLogRepository } from '@/car/service-log/application/repository/service-log';

export function createMockServiceLogRepository() {
  return {
    store: jest.fn(),
    getById: jest.fn(),
  } as unknown as jest.Mocked<ServiceLogRepository>;
}
