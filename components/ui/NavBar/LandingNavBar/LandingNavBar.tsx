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
      <div
        aria-hidden
        className="border-alpha-grey-300 bg-light-500 dark:bg-dark-500 absolute top-0 left-0 z-10 h-full w-full border-b"
      />
      <BrandLabel className="z-20" />
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
