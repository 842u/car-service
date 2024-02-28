import { ReactNode } from 'react';

import { LandingNavBar } from '@/components/ui/NavBar/LandingNavBar/LandingNavBar';

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <LandingNavBar />
      {children}
    </>
  );
}
