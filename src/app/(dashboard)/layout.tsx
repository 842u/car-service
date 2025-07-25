import { ReactNode } from 'react';

import { DashboardNavBar } from '@/components/ui/nav-bars/DashboardNavBar/DashboardNavBar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DashboardNavBar />
      {children}
    </>
  );
}
