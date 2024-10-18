import { ComponentPropsWithoutRef } from 'react';

export function MoonIcon({ ...props }: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 200 200"
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M181 125A81 81 0 0 1 69 50c0-11 2-22 6-31a81 81 0 1 0 106 106Z" />
    </svg>
  );
}
