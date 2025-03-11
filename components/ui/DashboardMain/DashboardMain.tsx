import { ReactNode } from 'react';

type DashboardMainProps = {
  children: ReactNode;
};

export function DashboardMain({ children }: DashboardMainProps) {
  return (
    <main className="flex min-h-screen max-w-screen items-center justify-center pt-16 md:pl-16">
      {children}
    </main>
  );
}
