import { ComponentPropsWithoutRef } from 'react';

export function XCircleIcon({ ...props }: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 200 200"
      {...props}
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m81 81 38 38m0-38-38 38m94-19a75 75 0 1 1-150 0 75 75 0 0 1 150 0Z" />
    </svg>
  );
}
