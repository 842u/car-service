import { jest } from '@jest/globals';

import type { UserMapper } from '@/user/application/mapper/user';

export function createMockUserMapper(): jest.Mocked<UserMapper> {
  return {
    authIdentityToDomain: jest.fn<UserMapper['authIdentityToDomain']>(),
    domainToDto: jest.fn<UserMapper['domainToDto']>(),
    domainToPersistence: jest.fn<UserMapper['domainToPersistence']>(),
    persistenceToDomain: jest.fn<UserMapper['persistenceToDomain']>(),
    persistenceToDto: jest.fn<UserMapper['persistenceToDto']>(),
  };
}
