import { ReactNode } from 'react';

import { LandingNavBar } from '@/features/landing/ui/LandingNavBar/LandingNavBar';

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <LandingNavBar />
      {children}
    </>
  );
}
