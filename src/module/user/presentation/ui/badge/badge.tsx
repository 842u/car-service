import { twMerge } from 'tailwind-merge';

import type { UserDto } from '@/user/application/dto/user';

import { UserImage } from '../image/image';

export const USER_BADGE_TEST_ID = 'user-badge';

type UserBadgeProps = {
  user: UserDto;
  className?: string;
};

export function UserBadge({ user, className }: UserBadgeProps) {
  return (
    <div
      className={twMerge('flex min-w-0 items-center gap-2', className)}
      data-testid={USER_BADGE_TEST_ID}
    >
      <p className="min-w-0 overflow-x-auto whitespace-nowrap">{user.name}</p>
      {/*
        Fixed square size rather than `h-full aspect-square w-fit`: a width
        derived from a percentage height through an aspect ratio is not
        transferred into the flex container's intrinsic width in Firefox, so
        the avatar contributed 0 to the badge's max-content width and then ate
        that width back from the name at layout time (scrollbar on a name that
        fits).
      */}
      <UserImage
        className="border-alpha-grey-300 size-12 shrink-0 overflow-hidden rounded-full border"
        src={user.avatarUrl}
      />
    </div>
  );
}
