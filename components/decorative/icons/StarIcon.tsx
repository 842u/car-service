import { ComponentPropsWithoutRef } from 'react';

export function StarIcon({ ...props }: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      {...props}
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11.5 3.5a.6.6 0 0 1 1 0l2.1 5.1a.6.6 0 0 0 .5.4l5.5.4c.5 0 .7.7.4 1L16.8 14a.6.6 0 0 0-.2.5l1.3 5.4a.6.6 0 0 1-.9.6l-4.7-2.8a.6.6 0 0 0-.6 0L7 20.5a.6.6 0 0 1-1-.5l1.3-5.4a.6.6 0 0 0-.2-.5L3 10.4a.6.6 0 0 1 .4-1L8.9 9a.6.6 0 0 0 .5-.4l2-5.1Z" />
    </svg>
  );
}
