import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

import { BrandLogoFull } from '@/components/decorative/icons/BrandLogoFull';
import { ImageWithPreviewProps } from '@/types';

export function NewCarImageWithPreview({
  previewUrl,
  className,
}: ImageWithPreviewProps) {
  return (
    <div
      className={twMerge(
        'flex h-full w-full items-center justify-center p-20 md:p-10',
        className,
      )}
    >
      {previewUrl && (
        <Image
          fill
          alt="avatar image"
          className="object-contain"
          src={previewUrl}
        />
      )}

      {!previewUrl && (
        <BrandLogoFull className="stroke-alpha-grey-600 stroke-1 object-contain" />
      )}
    </div>
  );
}
