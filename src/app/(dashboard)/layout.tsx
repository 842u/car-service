import { ReactNode } from 'react';

import { DashboardNavBar } from '@/features/dashboard/ui/DashboardNavBar/DashboardNavBar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DashboardNavBar />
      {children}
    </>
  );
}
