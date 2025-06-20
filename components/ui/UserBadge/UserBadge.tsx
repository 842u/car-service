import { twMerge } from 'tailwind-merge';

import { Profile } from '@/types';

import { AvatarImage } from '../images/AvatarImage/AvatarImage';

export const USER_BADGE_TEST_ID = 'user badge';

type UserBadgeProps = {
  userProfile: Profile;
  className?: string;
};

export function UserBadge({ userProfile, className }: UserBadgeProps) {
  return (
    <div
      className={twMerge(
        'flex flex-row items-center justify-center gap-2 overflow-auto',
        className,
      )}
      data-testid={USER_BADGE_TEST_ID}
    >
      <p className="overflow-auto">{userProfile.username}</p>
      <AvatarImage
        className="border-alpha-grey-300 aspect-square h-full w-fit shrink-0 overflow-hidden rounded-full border"
        src={userProfile.avatar_url}
      />
    </div>
  );
}
