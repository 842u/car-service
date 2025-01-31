import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type CardImageProps = {
  className?: string;
  children?: ReactNode;
};

export function CardImage({ className, children }: CardImageProps) {
  return (
    <div
      className={twMerge(
        'bg-light-500 dark:bg-dark-500 rounded-2xl',
        className,
      )}
    >
      {children}
    </div>
  );
}
