import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

import { BrandLogoFull } from '@/components/decorative/icons/BrandLogoFull';

type CarImageProps = {
  src?: string | null;
  className?: string;
};

export function CarImage({ src, className }: CarImageProps) {
  return (
    <div
      className={twMerge(
        'flex h-full w-full items-center justify-center p-20 md:p-10',
        className,
      )}
    >
      {src && (
        <Image fill alt="new car image" className="object-cover" src={src} />
      )}

      {!src && (
        <BrandLogoFull className="stroke-alpha-grey-600 stroke-1 object-cover" />
      )}
    </div>
  );
}
