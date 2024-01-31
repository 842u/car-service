'use client';

import { useState } from 'react';

import { BrandLabel } from '@/components/decorative/BrandLabel';

import { HamburgerButton } from '../HamburgerButton/HamburgerButton';
import { NavMenu } from './NavMenu';

export function NavBar() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <header className="fixed z-50 flex h-16 w-full items-center justify-between border-b border-alpha-grey-500 bg-light-500 px-5 transition-[background-color] dark:bg-dark-500">
      <div
        aria-hidden
        className="absolute left-0 z-10 box-content h-full w-full border-b border-alpha-grey-500 bg-light-500 transition-all dark:bg-dark-500 lg:hidden"
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
      <NavMenu isActive={navOpen} />
    </header>
  );
}
