import { ComponentPropsWithoutRef } from 'react';

export function EyeOpenIcon({ ...props }: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 200 200"
      {...props}
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 103v-6a88 88 0 0 1 166 0v6a87 87 0 0 1-166 0Z" />
      <path d="M125 100a25 25 0 1 1-50 0 25 25 0 0 1 50 0Z" />
    </svg>
  );
}
