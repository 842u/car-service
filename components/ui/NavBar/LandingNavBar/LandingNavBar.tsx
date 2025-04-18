'use client';

import { useState } from 'react';

import { NavBarBackground } from '@/components/decorative/NavBarBackground';

import { BrandLabel } from '../../BrandLabel/BrandLabel';
import { HamburgerButton } from '../../buttons/HamburgerButton/HamburgerButton';
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
      <BrandLabel className="z-10 h-full" />
      <HamburgerButton
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
