'use client';

import { useState } from 'react';

import { BrandLabel } from '../../../../features/common/ui/BrandLabel/BrandLabel';
import { HamburgerButton } from '../../../../features/common/ui/HamburgerButton/HamburgerButton';
import { NavBar } from '../../../../features/common/ui/NavBar/NavBar';
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
