import type { ReactNode } from 'react';

import { DashboardNavBar } from '@/dashboard/ui/nav-bar/nav-bar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DashboardNavBar />
      {children}
    </>
  );
}
