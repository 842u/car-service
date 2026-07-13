import type { ServiceLogMapper } from '@/car/service-log/application/mapper/service-log';

export function createMockServiceLogMapper() {
  return {
    domainToDto: jest.fn(),
    domainToPersistence: jest.fn(),
    persistenceToDomain: jest.fn(),
    persistenceToDto: jest.fn(),
  } as unknown as jest.Mocked<ServiceLogMapper>;
}
