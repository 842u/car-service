import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

type FeatureCardIconProps = ComponentProps<'div'>;

export function FeatureCardIcon({
  className,
  children,
  ...props
}: FeatureCardIconProps) {
  return (
    <div
      className={twMerge(
        'bg-light-500 dark:bg-dark-500 border-alpha-grey-300 relative z-10 w-16 overflow-hidden rounded-md border p-1',
        className,
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="bg-alpha-grey-50 absolute top-0 left-0 h-full w-full"
      />
      {children}
    </div>
  );
}
