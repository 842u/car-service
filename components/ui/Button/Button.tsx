import { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

import { ButtonVariants } from '@/types';
import { buttonVariants } from '@/utils/tailwindcss/button';

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  className?: string;
  variant?: ButtonVariants;
};

export function Button({
  className,
  variant = 'default',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      {...props}
      className={twMerge(buttonVariants[variant], 'h-10', className)}
    >
      {children}
    </button>
  );
}
