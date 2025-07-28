import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

type BackgroundProps = ComponentProps<'div'>;

export function Background({ className, children, ...props }: BackgroundProps) {
  return (
    <div
      aria-hidden
      className={twMerge(
        'absolute h-[130%] w-[130%] rotate-12 @sm:top-16 @sm:right-10 @sm:h-3/4 @sm:w-auto @sm:-rotate-12',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
