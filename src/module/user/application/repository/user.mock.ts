import { jest } from '@jest/globals';

import type { UserRepository } from '@/user/application/repository/user';

export function createMockUserRepository(): jest.Mocked<UserRepository> {
  return {
    getById: jest.fn<UserRepository['getById']>(),
    update: jest.fn<UserRepository['update']>(),
    store: jest.fn<UserRepository['store']>(),
    remove: jest.fn<UserRepository['remove']>(),
  };
}
