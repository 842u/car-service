'use client';

import { useId, useState } from 'react';

import { NavBarNav } from '@/landing/ui/nav-bar/nav/nav';
import { BrandLabel } from '@/ui/brand-label/brand-label';
import { HamburgerButton } from '@/ui/hamburger-button/hamburger-button';
import { NavBar } from '@/ui/nav-bar/nav-bar';

export function LandingNavBar() {
  const navId = useId();
  const [isActive, setIsActive] = useState(false);

  const handleNavClick = () => {
    setIsActive(false);
  };

  const handleHamburgerButtonClick = () => {
    setIsActive((currentState) => !currentState);
  };

  return (
    <NavBar>
      <BrandLabel className="z-10 h-full" />
      <HamburgerButton
        aria-controls={navId}
        aria-expanded={isActive}
        className="z-20 lg:hidden"
        isActive={isActive}
        onClick={handleHamburgerButtonClick}
      />
      <NavBarNav
        className="z-0 lg:z-20"
        id={navId}
        isActive={isActive}
        onClick={handleNavClick}
      />
    </NavBar>
  );
}
