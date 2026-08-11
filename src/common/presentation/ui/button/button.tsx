import type { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

import type { ButtonSizes, ButtonVariants } from '@/ui/variants/button';
import { buttonSizes, buttonVariants } from '@/ui/variants/button';

export type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  className?: string;
  variant?: ButtonVariants;
  size?: ButtonSizes;
};

export function Button({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      {...props}
      className={twMerge(
        buttonVariants[variant],
        buttonSizes[size],
        'block',
        className,
      )}
    >
      {children}
    </button>
  );
}
