import { Badge } from '@/ui/badge/badge';
import type { UserDto } from '@/user/application/dto/user';

import { UserImage } from '../image/image';

export const USER_BADGE_TEST_ID = 'user-badge';

type UserBadgeProps = {
  user: UserDto;
  className?: string;
};

export function UserBadge({ user, className }: UserBadgeProps) {
  return (
    <Badge
      className={className}
      data-testid={USER_BADGE_TEST_ID}
      image={<UserImage src={user.avatarUrl} />}
      label={user.name}
    />
  );
}
