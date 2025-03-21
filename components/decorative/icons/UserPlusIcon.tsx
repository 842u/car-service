import { ComponentPropsWithoutRef } from 'react';

export function UserPlusIcon({ ...props }: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      fill="none"
      stroke="#000"
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.3-4.1a3.4 3.4 0 1 1-6.7 0 3.4 3.4 0 0 1 6.8 0ZM3 19.2v0a6.4 6.4 0 0 1 12.8 0v0A12.3 12.3 0 0 1 9.3 21C7 21 4.9 20.4 3 19.2Z" />
    </svg>
  );
}
