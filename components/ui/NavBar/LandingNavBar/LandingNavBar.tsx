'use client';

import { useState } from 'react';

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
      <BrandLabel className="z-10" />
      <HamburgerButton
        aria-label="toggle navigation menu"
        className="z-10 lg:hidden"
        isActive={isActive}
        onClick={hamburgerButtonClickHandler}
      />
      <LandingNavMenu
        className="-z-10 lg:z-0"
        isActive={isActive}
        onClick={navMenuClickHandler}
      />
    </NavBar>
  );
}
