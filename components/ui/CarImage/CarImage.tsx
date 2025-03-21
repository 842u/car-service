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
        'relative flex aspect-square w-full items-center justify-center',
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
