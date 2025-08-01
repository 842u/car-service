import Link from 'next/link';
import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

import type { ButtonVariants } from '@/types';
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
        'block h-10 px-5 py-2 text-sm',
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
