import type { UserMapper } from '@/user/application/mapper/user';

export function createMockUserMapper() {
  return {
    authIdentityToDomain: jest.fn(),
    domainToDto: jest.fn(),
    domainToPersistence: jest.fn(),
    dtoToDomain: jest.fn(),
    dtoToPersistence: jest.fn(),
    persistenceToDomain: jest.fn(),
    persistenceToDto: jest.fn(),
  } as unknown as jest.Mocked<UserMapper>;
}
