import type { ComponentProps, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type BadgeProps = ComponentProps<'div'> & {
  label: string;
  image: ReactNode;
};

/**
 * A label next to a round image, sized to fit whatever box it is dropped into.
 * Callers control the order with `flex-row-reverse`.
 */
export function Badge({ label, image, className, ...props }: BadgeProps) {
  return (
    <div
      className={twMerge('flex min-w-0 items-center gap-2', className)}
      {...props}
    >
      <p className="truncate" title={label}>
        {label}
      </p>
      {/*
        A definite square rather than `h-full aspect-square w-fit`: a width
        derived from a percentage height through an aspect ratio is not
        transferred into the flex container's intrinsic width in Firefox, so
        the image contributed 0 to the badge's max-content width and then took
        that width back from the label at layout time.
      */}
      <div className="border-alpha-grey-300 size-10 shrink-0 overflow-hidden rounded-full border">
        {image}
      </div>
    </div>
  );
}
