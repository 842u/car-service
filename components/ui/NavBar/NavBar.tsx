'use client';

import { useState } from 'react';

import { BrandLabel } from '@/components/decorative/icons/brand/BrandLabel';

import { HamburgerButton } from '../HamburgerButton/HamburgerButton';
import { NavMenu } from './NavMenu';

export function NavBar() {
  const [navOpen, setNavOpen] = useState(false);

  const navMenuClickHandler = () => {
    setNavOpen(false);
  };

  return (
    <header className="fixed left-0 top-0 z-50 h-16 w-full border-b border-alpha-grey-300 bg-light-500 px-5 transition-[background-color] dark:bg-dark-500">
      <div className="m-auto flex h-full w-11/12 max-w-7xl items-center justify-between md:w-10/12">
        <div
          aria-hidden
          className="absolute left-0 z-10 box-content h-full w-full border-b border-alpha-grey-300 bg-light-500 transition-all dark:bg-dark-500 lg:hidden"
        />
        <BrandLabel className="z-10" />
        <HamburgerButton
          aria-label="toggle navigation menu"
          className="z-10 lg:hidden"
          isActive={navOpen}
          onClick={() => {
            setNavOpen((currentState) => !currentState);
          }}
        />
        <NavMenu isActive={navOpen} onMenuClick={navMenuClickHandler} />
      </div>
    </header>
  );
}
