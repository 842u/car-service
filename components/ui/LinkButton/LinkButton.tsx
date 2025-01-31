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
        'border-accent-500 bg-accent-800 text-light-500 block h-fit rounded-md border px-5 py-1.5 text-center text-sm',
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
