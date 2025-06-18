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
      className={twMerge('md:flex md:items-center md:gap-3', className)}
      data-testid={USER_BADGE_TEST_ID}
    >
      <p className="hidden md:inline-block md:overflow-hidden">
        {userProfile.username}
      </p>
      <AvatarImage
        className="border-alpha-grey-300 aspect-square h-full w-auto overflow-hidden rounded-full border"
        src={userProfile.avatar_url}
      />
    </div>
  );
}
