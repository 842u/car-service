import Image from 'next/image';

import { BrandLogoFull } from '@/components/decorative/icons/BrandLogoFull';

type CarImagePreviewProps = {
  src?: string | null;
  className?: string;
};

export function CarImagePreview({ src, className }: CarImagePreviewProps) {
  return (
    <div className={className}>
      {src ? (
        <Image fill alt="car image" className="object-contain" src={src} />
      ) : (
        <BrandLogoFull className="stroke-alpha-grey-600 stroke-1" />
      )}
    </div>
  );
}
