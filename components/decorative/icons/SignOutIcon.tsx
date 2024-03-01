import { ComponentPropsWithoutRef } from 'react';

export function SignOutIcon({ ...props }: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 200 200"
      {...props}
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M131 75V44a19 19 0 0 0-18-19H63a19 19 0 0 0-19 19v112a19 19 0 0 0 19 19h50a19 19 0 0 0 18-19v-31m25 0 25-25m0 0-25-25m25 25H75" />
    </svg>
  );
}
