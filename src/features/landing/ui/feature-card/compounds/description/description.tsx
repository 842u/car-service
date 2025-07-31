import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

type DescriptionProps = ComponentProps<'p'>;

export function Description({
  className,
  children,
  ...props
}: DescriptionProps) {
  return (
    <p
      className={twMerge('text-light-800 text-sm @sm:w-3/4', className)}
      {...props}
    >
      {children}
    </p>
  );
}
