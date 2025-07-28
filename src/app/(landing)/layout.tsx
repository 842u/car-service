import { ReactNode } from 'react';

import { NavBar } from '@/features/landing/ui/nav-bar/nav-bar';

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
