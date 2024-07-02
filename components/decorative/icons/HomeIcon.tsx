import { ComponentPropsWithoutRef } from 'react';

export function HomeIcon({ ...props }: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 200 200"
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m19 100 74-75c4-3 10-3 14 0l74 75M38 81v85c0 5 4 9 9 9h34v-41c0-5 4-9 10-9h18c6 0 10 4 10 9v41h34c5 0 10-4 10-9V81m-94 94h69" />
    </svg>
  );
}