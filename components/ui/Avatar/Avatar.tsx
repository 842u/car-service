import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

import { UserIcon } from '@/components/decorative/icons/UserIcon';

export const AVATAR_TEST_ID = 'avatar';

type AvatarProps = {
  src?: string;
  className?: string;
};

export function Avatar({ src, className }: AvatarProps) {
  return (
    <div
      className={twMerge(
        'border-alpha-grey-300 relative h-24 w-24 rounded-full border-2',
        className,
      )}
      data-testid={AVATAR_TEST_ID}
    >
      {src ? (
        <Image fill alt="user avatar" className="rounded-full" src={src} />
      ) : (
        <UserIcon className="stroke-alpha-grey-500 stroke-2" />
      )}
    </div>
  );
}
