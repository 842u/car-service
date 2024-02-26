import { ReactNode } from 'react';

import { NavBar } from '@/components/ui/NavBar/NavBar';

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
