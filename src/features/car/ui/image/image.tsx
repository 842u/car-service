import NextImage from 'next/image';
import { twMerge } from 'tailwind-merge';

import { BrandFullIcon } from '@/icons/brand-full';

type ImageProps = {
  src?: string | null;
  className?: string;
};

export function Image({ src, className }: ImageProps) {
  return (
    <div
      className={twMerge(
        'relative flex aspect-square w-full items-center justify-center',
        className,
      )}
    >
      {src && (
        <NextImage fill alt="car image" className="object-cover" src={src} />
      )}

      {!src && (
        <BrandFullIcon className="stroke-alpha-grey-600 stroke-[0.1] object-cover" />
      )}
    </div>
  );
}
