import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

import { BrandLogoFull } from '@/components/decorative/icons/BrandLogoFull';

type CarImageProps = {
  src?: string;
  className?: string;
};

export function CarImage({ src, className }: CarImageProps) {
  return (
    <div
      className={twMerge(
        'border-alpha-grey-300 relative w-64 overflow-hidden rounded-lg border',
        className,
      )}
    >
      {src ? (
        <Image fill alt="car image" src={src} />
      ) : (
        <BrandLogoFull className="stroke-accent-500 stroke-2" />
      )}
    </div>
  );
}
