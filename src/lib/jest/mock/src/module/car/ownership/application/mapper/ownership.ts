import type { OwnershipMapper } from '@/car/ownership/application/mapper/ownership';

export function createMockOwnershipMapper() {
  return {
    domainToDto: jest.fn(),
    persistenceToDomain: jest.fn(),
    persistenceToDto: jest.fn(),
    newCoOwnerToPersistence: jest.fn(),
    primaryOwnerToPersistence: jest.fn(),
  } as unknown as jest.Mocked<OwnershipMapper>;
}
