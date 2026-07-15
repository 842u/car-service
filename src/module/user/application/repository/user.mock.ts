import type { UserRepository } from '@/user/application/repository/user';

export function createMockUserRepository() {
  return {
    getById: jest.fn(),
    update: jest.fn(),
    store: jest.fn(),
    remove: jest.fn(),
  } as unknown as jest.Mocked<UserRepository>;
}
