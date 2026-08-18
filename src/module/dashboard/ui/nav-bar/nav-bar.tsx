'use client';

import type { NavMode } from '@/dashboard/ui/nav-mode/nav-mode';
import { BrandLabel } from '@/ui/brand-label/brand-label';
import { Spinner } from '@/ui/decorative/spinner/spinner';
import { HamburgerButton } from '@/ui/hamburger-button/hamburger-button';
import { NavBar } from '@/ui/nav-bar/nav-bar';
import { UserBadge } from '@/user/presentation/ui/badge/badge';

import { NavBarNav } from './nav/nav';
import { useDashboardNavBar } from './use-nav-bar';

type DashboardNavBarProps = {
  navMode: NavMode;
};

export function DashboardNavBar({ navMode }: DashboardNavBarProps) {
  const {
    user,
    isPending,
    navId,
    isActive,
    handleHamburgerButtonClick,
    handleNavClick,
  } = useDashboardNavBar();

  return (
    <NavBar>
      <BrandLabel className="z-10 h-full" />
      {isPending && (
        <Spinner className="fill-accent-400 stroke-accent-400 z-10 h-full" />
      )}
      {user && <UserBadge className="z-10" user={user} />}
      <HamburgerButton
        aria-controls={navId}
        aria-expanded={isActive}
        className="z-10 md:hidden"
        isActive={isActive}
        onClick={handleHamburgerButtonClick}
      />
      <NavBarNav
        id={navId}
        isActive={isActive}
        navMode={navMode}
        onClose={handleNavClick}
        onNavigate={handleNavClick}
      />
    </NavBar>
  );
}
