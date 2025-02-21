import Image from 'next/image';

import { BrandLogoFull } from '@/components/decorative/icons/BrandLogoFull';

type CarImageProps = {
  src?: string;
  className?: string;
};

export function CarImage({ src, className }: CarImageProps) {
  return (
    <div className={className}>
      {src ? (
        <Image fill alt="car image" src={src} />
      ) : (
        <BrandLogoFull className="stroke-alpha-grey-300 stroke-2" />
      )}
    </div>
  );
}
