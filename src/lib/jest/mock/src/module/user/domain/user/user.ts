import { User } from '@/user/domain/user/user';
import { Email } from '@/user/domain/user/value-object/email/email';
import { Name } from '@/user/domain/user/value-object/name/name';
import { UserId } from '@/user/domain/user/value-object/user-id/user-id';

export function createMockUser({
  id = '44dd8410-a912-480f-95be-9ad4cbe30d7f',
  email = 'test@example.com',
  name = 'Test User',
}: { id?: string; email?: string; name?: string } = {}): User {
  const userIdResult = UserId.create(id);
  const emailResult = Email.create(email);
  const userNameResult = Name.create(name);

  if (
    !userIdResult.success ||
    !emailResult.success ||
    !userNameResult.success
  ) {
    throw new Error('Failed to create mock user');
  }

  const userResult = User.create({
    id: userIdResult.data.value,
    email: emailResult.data.value,
    name: userNameResult.data.value,
    avatarUrl: undefined,
  });

  if (!userResult.success) {
    throw new Error('Failed to create mock user');
  }

  return userResult.data;
}
