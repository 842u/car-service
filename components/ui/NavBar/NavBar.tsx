import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type NavBarProps = {
  children: ReactNode;
  className?: string;
};

export function NavBar({ children, className }: NavBarProps) {
  return (
    <header
      className={twMerge(
        'fixed top-0 z-10 flex h-16 w-full justify-between px-2 md:px-4 lg:px-6',
        className,
      )}
    >
      {children}
    </header>
  );
}
