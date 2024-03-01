import { ComponentPropsWithoutRef } from 'react';

export function SunIcon({ ...props }: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 200 200"
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M100 25v19m53 3-13 13m35 40h-19m-3 53-13-13m-40 16v19m-40-35-13 13m-3-53H25m35-40L47 47m84 53a31 31 0 1 1-62 0 31 31 0 0 1 62 0Z" />
    </svg>
  );
}
