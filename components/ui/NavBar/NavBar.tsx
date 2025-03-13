import { ReactNode } from 'react';

type NavBarProps = {
  children: ReactNode;
};

export function NavBar({ children }: NavBarProps) {
  return (
    <header className="fixed top-0 z-10 flex h-16 w-full justify-between px-2 md:px-4 lg:px-6">
      {children}
    </header>
  );
}
