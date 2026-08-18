'use client';

import { BrandLabel } from '@/ui/brand-label/brand-label';
import { Spinner } from '@/ui/decorative/spinner/spinner';
import { HamburgerButton } from '@/ui/hamburger-button/hamburger-button';
import { NavBar } from '@/ui/nav-bar/nav-bar';
import { UserBadge } from '@/user/presentation/ui/badge/badge';

import { NavBarNav } from './nav/nav';
import { useDashboardNavBar } from './use-nav-bar';

export function DashboardNavBar() {
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
        onClose={handleNavClick}
        onNavigate={handleNavClick}
      />
    </NavBar>
  );
}
