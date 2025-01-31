import { ReactNode } from 'react';

type NavBarProps = {
  children: ReactNode;
};

export function NavBar({ children }: NavBarProps) {
  return (
    <header className="border-alpha-grey-300 fixed z-50 flex h-16 w-full justify-between border-b px-2 md:px-4 lg:px-6">
      <div
        aria-hidden
        className="border-alpha-grey-300 bg-light-500 dark:bg-dark-500 absolute left-0 z-0 box-content h-full w-full border-b transition-all"
      />
      {children}
    </header>
  );
}
