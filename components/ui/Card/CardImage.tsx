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
        'rounded-2xl bg-light-500 transition-[background-color] dark:bg-dark-500',
        className,
      )}
    >
      {children}
    </div>
  );
}
