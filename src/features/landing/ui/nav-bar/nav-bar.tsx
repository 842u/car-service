'use client';

import { useState } from 'react';

import { NavBarNav } from '@/landing/ui/nav-bar/nav/nav';
import { BrandLabel } from '@/ui/brand-label/brand-label';
import { HamburgerButton } from '@/ui/hamburger-button/hamburger-button';
import { NavBar } from '@/ui/nav-bar/nav-bar';

export function LandingNavBar() {
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
        className="z-20 lg:hidden"
        isActive={isActive}
        onClick={handleHamburgerButtonClick}
      />
      <NavBarNav
        className="z-0 lg:z-20"
        isActive={isActive}
        onClick={handleNavClick}
      />
    </NavBar>
  );
}
