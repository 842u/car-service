import type { ServiceLogMapper } from '@/car/service-log/application/mapper/service-log';

export function createMockServiceLogMapper() {
  return {
    persistenceToDto: jest.fn(),
  } as unknown as jest.Mocked<ServiceLogMapper>;
}
