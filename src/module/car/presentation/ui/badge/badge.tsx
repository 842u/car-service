import { twMerge } from 'tailwind-merge';

import { CarImage } from '@/car/presentation/ui/image/image';

type CarBadgeProps = {
  name: string;
  imageUrl?: string | null;
  className?: string;
};

export function CarBadge({ name, imageUrl, className }: CarBadgeProps) {
  return (
    <div
      className={twMerge(
        'flex flex-row items-center justify-center gap-2 overflow-auto',
        className,
      )}
    >
      <p className="truncate">{name}</p>
      <CarImage
        className="border-alpha-grey-300 aspect-square h-full w-fit shrink-0 overflow-hidden rounded-full border"
        src={imageUrl}
      />
    </div>
  );
}
