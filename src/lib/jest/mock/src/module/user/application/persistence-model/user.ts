import type { UserPersistence } from '@/user/application/persistence-model/user';

export function createMockUserPersistence(
  overrides?: Partial<UserPersistence>,
): UserPersistence {
  return {
    id: '44dd8410-a912-480f-95be-9ad4cbe30d7f',
    email: 'test@example.com',
    user_name: 'Test User',
    avatar_url: null,
    ...overrides,
  };
}
