import Link from 'next/link';
import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

import type { ButtonSizes, ButtonVariants } from '@/ui/variants/button';
import { buttonSizes } from '@/ui/variants/button';
import { linkButtonVariants } from '@/ui/variants/link';

type LinkButtonProps = ComponentProps<typeof Link> & {
  className?: string;
  variant?: ButtonVariants;
  size?: ButtonSizes;
};

export function LinkButton({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={twMerge(
        linkButtonVariants[variant],
        buttonSizes[size],
        'block text-sm',
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
