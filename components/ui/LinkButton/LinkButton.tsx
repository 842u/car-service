import Link from 'next/link';
import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

import { ButtonVariants } from '@/types';
import { buttonVariants } from '@/utils/tailwindcss/button';

type LinkButtonProps = ComponentProps<typeof Link> & {
  className?: string;
  variant?: ButtonVariants;
};

export function LinkButton({
  className,
  variant = 'default',
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={twMerge(
        buttonVariants[variant],
        'block px-5 py-2 text-sm',
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
