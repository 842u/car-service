import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

import { UserIcon } from '@/features/common/ui/decorative/icons/user';

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
        <div className="h-full w-full py-2">
          <UserIcon className="stroke-alpha-grey-600 h-full w-full object-cover" />
        </div>
      )}
    </div>
  );
}
