import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type CardDescriptionProps = {
  className?: string;
  children?: ReactNode;
};

export function CardDescription({ className, children }: CardDescriptionProps) {
  return (
    <p className={twMerge('text-sm text-light-800', className)}>{children}</p>
  );
}
