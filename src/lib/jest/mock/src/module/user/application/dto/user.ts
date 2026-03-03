import type { UserDto } from '@/user/application/dto/user';

export function createMockUserDto(overrides?: Partial<UserDto>): UserDto {
  return {
    id: '44dd8410-a912-480f-95be-9ad4cbe30d7f',
    email: 'test@example.com',
    name: 'Test User',
    avatarUrl: null,
    ...overrides,
  };
}
