import { twMerge } from 'tailwind-merge';

import { BrandFullIcon } from '@/icons/brand-full';
import { ImageWithFallback } from '@/ui/image/image';

type CarImageProps = {
  src?: string | null;
  className?: string;
};

export function CarImage({ src, className }: CarImageProps) {
  return (
    <ImageWithFallback
      alt="car image"
      className={twMerge(
        'flex aspect-square w-full items-center justify-center',
        className,
      )}
      fallback={
        <BrandFullIcon className="stroke-alpha-grey-600 stroke-[0.1]" />
      }
      src={src}
    />
  );
}
