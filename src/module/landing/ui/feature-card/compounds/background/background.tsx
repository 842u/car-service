import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

type FeatureCardBackgroundProps = ComponentProps<'div'>;

export function FeatureCardBackground({
  className,
  children,
  ...props
}: FeatureCardBackgroundProps) {
  return (
    <div
      aria-hidden
      className={twMerge(
        'group-hover:**:stroke-accent-300/50 absolute h-[130%] w-[130%] rotate-12 **:transition-[stroke] **:ease-in-out @sm:top-16 @sm:right-10 @sm:h-3/4 @sm:w-auto @sm:-rotate-12',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
