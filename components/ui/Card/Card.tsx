import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type CardProps = { className?: string; children?: ReactNode };

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={twMerge(
        'rounded-2xl border border-alpha-grey-200 bg-gradient-to-tr from-alpha-grey-200 via-alpha-grey-100 to-alpha-grey-50 p-6 shadow-lg drop-shadow-lg',
        className,
      )}
    >
      {children}
    </div>
  );
}
