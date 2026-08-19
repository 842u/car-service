import { twMerge } from 'tailwind-merge';

import { UserIcon } from '@/icons/user';
import { ImageWithFallback } from '@/ui/image/image';

type UserImageProps = {
  src?: string | null;
  className?: string;
  sizes?: string;
};

export function UserImage({ src, className, sizes }: UserImageProps) {
  return (
    <ImageWithFallback
      alt="avatar image"
      className={twMerge('h-full w-full', className)}
      fallback={
        <UserIcon className="stroke-alpha-grey-600 h-full w-full p-2" />
      }
      sizes={sizes}
      src={src}
    />
  );
}
