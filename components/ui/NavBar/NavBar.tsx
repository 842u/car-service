import { ReactNode } from 'react';

type NavBarProps = {
  children: ReactNode;
};

export function NavBar({ children }: NavBarProps) {
  return (
    <header className="bg-light-500 dark:bg-dark-500 border-alpha-grey-300 sticky top-0 z-10 flex h-16 w-full justify-between border-b px-2 md:px-4 lg:px-6">
      {children}
    </header>
  );
}
