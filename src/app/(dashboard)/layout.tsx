import { ReactNode } from 'react';

import { NavBar } from '@/dashboard/ui/nav-bar/nav-bar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
