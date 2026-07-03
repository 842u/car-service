'use client';

import { useState } from 'react';

import { BrandLabel } from '@/ui/brand-label/brand-label';
import { Spinner } from '@/ui/decorative/spinner/spinner';
import { HamburgerButton } from '@/ui/hamburger-button/hamburger-button';
import { NavBar } from '@/ui/nav-bar/nav-bar';
import { useSessionUser } from '@/user/presentation/hooks/use-session-user';
import { UserBadge } from '@/user/presentation/ui/badge/badge';

import { NavBarNav } from './nav/nav';

export function DashboardNavBar() {
  const { data, isPending } = useSessionUser();

  const [isActive, setIsActive] = useState(false);

  const handleHamburgerButtonClick = () => {
    setIsActive((currentState) => !currentState);
  };

  const handleNavClick = () => {
    if (isActive) {
      setIsActive(false);
    }
  };

  return (
    <NavBar>
      <BrandLabel className="z-10 h-full" />
      {isPending && (
        <Spinner className="fill-accent-400 stroke-accent-400 z-10 h-full" />
      )}
      {data && <UserBadge className="z-10" user={data} />}
      <HamburgerButton
        className="z-10 md:hidden"
        isActive={isActive}
        onClick={handleHamburgerButtonClick}
      />
      <NavBarNav isActive={isActive} onClick={handleNavClick} />
    </NavBar>
  );
}
