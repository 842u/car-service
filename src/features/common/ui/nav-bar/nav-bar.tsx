import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type NavBarProps = {
  children: ReactNode;
  className?: string;
};

export function NavBar({ children, className }: NavBarProps) {
  return (
    <header
      className={twMerge(
        'fixed top-0 z-50 flex h-16 w-full justify-between px-2 py-2 md:px-4 lg:px-6',
        className,
      )}
    >
      <div
        aria-hidden
        className="border-alpha-grey-300 bg-light-500 dark:bg-dark-500 absolute top-0 left-0 z-10 h-full w-full border-b"
      />
      {children}
    </header>
  );
}
