import { ComponentPropsWithoutRef } from 'react';

export function ExclamationCircleIcon({
  ...props
}: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 200 200"
      {...props}
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M100 75v31m75-6a75 75 0 1 1-150 0 75 75 0 0 1 150 0Zm-75 31h0v0h0v0Z" />
    </svg>
  );
}
