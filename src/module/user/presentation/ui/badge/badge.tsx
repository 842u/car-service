import { Badge } from '@/ui/badge/badge';
import type { UserDto } from '@/user/application/dto/user';

import { UserImage } from '../image/image';

type UserBadgeProps = {
  user: UserDto;
  className?: string;
};

export function UserBadge({ user, className }: UserBadgeProps) {
  return (
    <Badge
      className={className}
      image={<UserImage sizes="38px" src={user.avatarUrl} />}
      label={user.name}
    />
  );
}
