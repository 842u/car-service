import Link from 'next/link';
import { ComponentProps } from 'react';

type LinkButtonProps = ComponentProps<typeof Link>;

export function LinkButton({ children, ...props }: LinkButtonProps) {
  return (
    <Link
      className="rounded-md border border-accent bg-accent-darker px-2 py-1 text-xs text-light"
      {...props}
    >
      {children}
    </Link>
  );
}
