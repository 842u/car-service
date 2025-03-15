import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

import { UserIcon } from '@/components/decorative/icons/UserIcon';

type AvatarImageProps = {
  src?: string | null;
  className?: string;
};

export function AvatarImage({ src, className }: AvatarImageProps) {
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
        <UserIcon className="stroke-alpha-grey-600 stroke-2 object-cover" />
      )}
    </div>
  );
}
