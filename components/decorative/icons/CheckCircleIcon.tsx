import { ComponentPropsWithoutRef } from 'react';

export function CheckCircleIcon({ ...props }: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 200 200"
      {...props}
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m75 106 19 19 31-44m50 19a75 75 0 1 1-150 0 75 75 0 0 1 150 0Z" />
    </svg>
  );
}
