import type { UserRepository } from '@/user/application/repository/user';

export function createMockUserRepository() {
  return {
    getById: jest.fn(),
    changeAvatarUrl: jest.fn(),
  } as unknown as jest.Mocked<UserRepository>;
}
