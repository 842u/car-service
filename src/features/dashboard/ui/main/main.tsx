import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type DashboardMainProps = {
  children: ReactNode;
  className?: string;
};

export function DashboardMain({ children, className }: DashboardMainProps) {
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
