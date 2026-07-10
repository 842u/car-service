import type { CarMapper } from '@/car/application/mapper/car';

export function createMockCarMapper() {
  return {
    domainToDto: jest.fn(),
    domainToPersistence: jest.fn(),
    persistenceToDomain: jest.fn(),
    persistenceToDto: jest.fn(),
  } as unknown as jest.Mocked<CarMapper>;
}
