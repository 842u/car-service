import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

import { UserIcon } from '@/icons/user';

type UserImageProps = {
  src?: string | null;
  className?: string;
};

export function UserImage({ src, className }: UserImageProps) {
  return (
    <div className={twMerge('relative h-full w-full', className)}>
      {src && (
        <Image fill alt="avatar image" className="object-cover" src={src} />
      )}

      {!src && <UserIcon className="stroke-alpha-grey-600 object-cover p-2" />}
    </div>
  );
}
