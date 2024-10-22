'use client';

import { useState } from 'react';

import { BrandLabel } from '@/components/decorative/icons/brand/BrandLabel';

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
      <BrandLabel className="z-10" />
      <UserBadge />
      <HamburgerButton
        aria-label="toggle navigation menu"
        className="z-10 md:hidden"
        isActive={isActive}
        onClick={hamburgerButtonClickHandler}
      />
      <DashboardNavMenu
        className="-z-10"
        isActive={isActive}
        onClick={navMenuClickHandler}
      />
    </NavBar>
  );
}
