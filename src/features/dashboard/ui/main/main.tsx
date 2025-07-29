import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type MainProps = {
  children: ReactNode;
  className?: string;
};

export function Main({ children, className }: MainProps) {
  return (
    <main
      className={twMerge(
        'flex min-h-screen max-w-screen items-center justify-center pt-16 md:pl-16',
        className,
      )}
    >
      {children}
    </main>
  );
}
