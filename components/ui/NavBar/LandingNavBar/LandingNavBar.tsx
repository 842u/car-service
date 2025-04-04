'use client';

import { useState } from 'react';

import { NavBarBackground } from '@/components/decorative/NavBarBackground';

import { BrandLabel } from '../../BrandLabel/BrandLabel';
import { HamburgerButton } from '../../HamburgerButton/HamburgerButton';
import { NavBar } from '../NavBar';
import { LandingNavMenu } from './LandingNavMenu';

export function LandingNavBar() {
  const [isActive, setIsActive] = useState(false);

  const navMenuClickHandler = () => {
    setIsActive(false);
  };

  const hamburgerButtonClickHandler = () => {
    setIsActive((currentState) => !currentState);
  };

  return (
    <NavBar>
      <NavBarBackground />
      <BrandLabel className="z-10 my-auto" />
      <HamburgerButton
        aria-label="toggle navigation menu"
        className="z-20 lg:hidden"
        isActive={isActive}
        onClick={hamburgerButtonClickHandler}
      />
      <LandingNavMenu
        className="z-0 lg:z-20"
        isActive={isActive}
        onClick={navMenuClickHandler}
      />
    </NavBar>
  );
}
