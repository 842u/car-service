import Link from 'next/link';
import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

type LinkButtonProps = ComponentProps<typeof Link> & {
  className?: string;
};

export function LinkButton({ className, children, ...props }: LinkButtonProps) {
  return (
    <Link
      className={twMerge(
        'block rounded-md border border-accent-500 bg-accent-800 px-2 py-1 text-center text-light-500',
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
