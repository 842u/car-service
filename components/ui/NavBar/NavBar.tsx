import { ReactNode } from 'react';

type NavBarProps = {
  children: ReactNode;
};

export function NavBar({ children }: NavBarProps) {
  return (
    <header className="fixed z-50 flex h-16 w-full justify-between border-b border-alpha-grey-300 px-2 md:px-4 lg:px-6">
      <div
        aria-hidden
        className="absolute left-0 z-0 box-content h-full w-full border-b border-alpha-grey-300 bg-light-500 transition-all dark:bg-dark-500"
      />
      {children}
    </header>
  );
}
