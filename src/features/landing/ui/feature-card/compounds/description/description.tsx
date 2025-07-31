import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

type FeatureCardDescriptionProps = ComponentProps<'p'>;

export function FeatureCardDescription({
  className,
  children,
  ...props
}: FeatureCardDescriptionProps) {
  return (
    <p
      className={twMerge('text-light-800 text-sm @sm:w-3/4', className)}
      {...props}
    >
      {children}
    </p>
  );
}
