import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type CardProps = { className?: string; children?: ReactNode };

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={twMerge(
        'border-alpha-grey-300 from-light-600 to-light-500 dark:from-dark-600 dark:via-dark-500 dark:to-dark-450 rounded-2xl border bg-linear-to-tr p-6 shadow-lg drop-shadow-lg',
        className,
      )}
    >
      {children}
    </div>
  );
}
