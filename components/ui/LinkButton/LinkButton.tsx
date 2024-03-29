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
        'block h-fit rounded-md border border-accent-500 bg-accent-800 px-5 py-1.5 text-center text-sm text-light-500',
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
