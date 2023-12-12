import Link from 'next/link';
import { ComponentProps } from 'react';

type LinkButtonProps = ComponentProps<typeof Link>;

export function LinkButton({ children, ...props }: LinkButtonProps) {
  return (
    <Link
      className="bg-accent-darker inline-block rounded-md border border-accent px-2 py-1 text-xs text-light"
      {...props}
    >
      {children}
    </Link>
  );
}
