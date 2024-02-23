import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type CardProps = { className?: string; children?: ReactNode };

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={twMerge(
        'rounded-2xl border border-alpha-grey-300 bg-gradient-to-tr from-light-600 to-light-500 p-6 shadow-lg drop-shadow-lg dark:from-dark-600 dark:via-dark-500 dark:to-dark-450',
        className,
      )}
    >
      {children}
    </div>
  );
}
