'use client';

import { useState } from 'react';

import { NavBarBackground } from '@/components/decorative/NavBarBackground';

import { BrandLabel } from '../../BrandLabel/BrandLabel';
import { HamburgerButton } from '../../HamburgerButton/HamburgerButton';
import { UserBadge } from '../../UserBadge/UserBadge';
import { NavBar } from '../NavBar';
import { DashboardNavMenu } from './DashboardNavMenu';

export function DashboardNavBar() {
  const [isActive, setIsActive] = useState(false);

  const hamburgerButtonClickHandler = () => {
    setIsActive((currentState) => !currentState);
  };

  const navMenuClickHandler = () => {
    if (isActive) {
      setIsActive(false);
    }
  };

  return (
    <NavBar>
      <NavBarBackground />
      <BrandLabel className="z-10 h-full" />
      <UserBadge className="z-10" />
      <HamburgerButton
        className="z-10 md:hidden"
        isActive={isActive}
        onClick={hamburgerButtonClickHandler}
      />
      <DashboardNavMenu isActive={isActive} onClick={navMenuClickHandler} />
    </NavBar>
  );
}
