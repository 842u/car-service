import { ComponentPropsWithoutRef } from 'react';

export function GarageIcon({ ...props }: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 200 200"
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m18.8 100 74.6-74.6a9.4 9.4 0 0 1 13.2 0l74.7 74.6M37.4 81.2v84.4c0 5.2 4.2 9.4 9.4 9.4h26.5m89.1-93.8v84.4c0 5.2-4.2 9.4-9.4 9.4h-26.5m-53.2 0h53.2m-53.2 0v-18.8m53.2 18.8v-18.8m-53.2-18.7h53.2m-53.2 0v-18.8m0 18.8v18.8m53.2-18.8v-18.8m0 18.8v18.8m0-37.6V100H73.4v18.8m53.2 0H73.4m0 37.5h53.2" />
    </svg>
  );
}
