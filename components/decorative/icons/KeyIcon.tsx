import { ComponentPropsWithoutRef } from 'react';

export function KeyIcon({ ...props }: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      {...props}
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15.8 5.3a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7 5.9c-.6-.1-1.2 0-1.6.4l-2.7 2.7H8.2v2.2H6v2.3H2.2v-2.9c0-.6.3-1.1.7-1.6l6.5-6.5c.4-.4.5-1 .4-1.5a6 6 0 1 1 12-1Z" />
    </svg>
  );
}
