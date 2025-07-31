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
        'bg-alpha-grey-50 border-alpha-grey-300 w-16 overflow-hidden rounded-md border p-1',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
