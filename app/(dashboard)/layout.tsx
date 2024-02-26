import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <nav>dash nav bar</nav>
      {children}
    </>
  );
}
