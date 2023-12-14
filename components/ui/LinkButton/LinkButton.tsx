import Link from 'next/link';
import { ComponentProps } from 'react';

type LinkButtonProps = ComponentProps<typeof Link>;

export function LinkButton({ children, ...props }: LinkButtonProps) {
  return (
    <Link
      className="rounded-md border border-accent-500 bg-accent-800 px-2 py-1 text-xs text-light-500"
      {...props}
    >
      {children}
    </Link>
  );
}
