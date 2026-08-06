import { twMerge } from 'tailwind-merge';

import { CarImage } from '@/car/presentation/ui/image/image';

type CarBadgeProps = {
  name: string;
  imageUrl?: string | null;
  className?: string;
};

export function CarBadge({ name, imageUrl, className }: CarBadgeProps) {
  return (
    <div className={twMerge('flex min-w-0 items-center gap-2', className)}>
      <p className="truncate">{name}</p>
      {/*
        Fixed square size rather than `h-full aspect-square w-fit`: a width
        derived from a percentage height through an aspect ratio depends on the
        caller giving this badge a definite height, and collapses in Firefox
        wherever that height is a percentage or comes from a table cell.
      */}
      <CarImage
        className="border-alpha-grey-300 size-10 shrink-0 overflow-hidden rounded-full border"
        src={imageUrl}
      />
    </div>
  );
}
