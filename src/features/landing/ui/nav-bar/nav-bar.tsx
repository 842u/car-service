'use client';

import { useState } from 'react';

import { Nav } from '@/landing/ui/nav-bar/nav/nav';
import { BrandLabel } from '@/ui/brand-label/brand-label';
import { NavBar as BaseNavBar } from '@/ui/nav-bar/nav-bar';

import { HamburgerButton } from '../../../common/ui/hamburger-button/hamburger-button';

export function NavBar() {
  const [isActive, setIsActive] = useState(false);

  const navMenuClickHandler = () => {
    setIsActive(false);
  };

  const hamburgerButtonClickHandler = () => {
    setIsActive((currentState) => !currentState);
  };

  return (
    <BaseNavBar>
      <BrandLabel className="z-10 h-full" />
      <HamburgerButton
        className="z-20 lg:hidden"
        isActive={isActive}
        onClick={hamburgerButtonClickHandler}
      />
      <Nav
        className="z-0 lg:z-20"
        isActive={isActive}
        onClick={navMenuClickHandler}
      />
    </BaseNavBar>
  );
}
