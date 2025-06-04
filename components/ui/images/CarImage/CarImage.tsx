import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

import { BrandFullIcon } from '@/components/decorative/icons/BrandFullIcon';

export const CAR_IMAGE_TEST_ID = 'car image test id';

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
      data-testid={CAR_IMAGE_TEST_ID}
    >
      {src && <Image fill alt="car image" className="object-cover" src={src} />}

      {!src && (
        <BrandFullIcon className="stroke-alpha-grey-600 stroke-[0.1] object-cover" />
      )}
    </div>
  );
}
