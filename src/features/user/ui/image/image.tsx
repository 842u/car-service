import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

import { UserIcon } from '@/icons/user';

type UserImageProps = {
  src?: string | null;
  className?: string;
};

export function UserImage({ src, className }: UserImageProps) {
  return (
    <div
      className={twMerge(
        'relative flex h-full w-full items-center justify-center',
        className,
      )}
    >
      {src && (
        <Image fill alt="avatar image" className="object-cover" src={src} />
      )}

      {!src && (
        <div className="h-full w-full py-2">
          <UserIcon className="stroke-alpha-grey-600 h-full w-full object-cover" />
        </div>
      )}
    </div>
  );
}
