import type { ReactNode } from 'react';

import { LandingNavBar } from '@/landing/ui/nav-bar/nav-bar';

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <LandingNavBar />
      {children}
    </>
  );
}
