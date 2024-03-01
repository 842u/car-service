import { ComponentPropsWithoutRef } from 'react';

export function InformationCircleIcon({
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
      <path d="M94 94h0a6 6 0 0 1 9 7l-6 23a6 6 0 0 0 9 7h0m69-31a75 75 0 1 1-150 0 75 75 0 0 1 150 0Zm-75-31h0v0h0v0Z" />
    </svg>
  );
}
