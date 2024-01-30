'use client';

import { useState } from 'react';

import { BrandLabel } from '@/components/decorative/BrandLabel';

import { HamburgerButton } from '../HamburgerButton/HamburgerButton';
import { NavMenu } from './NavMenu';

export function NavBar() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <header className="fixed z-30 flex h-16 w-full items-center justify-between border-b border-alpha-grey-500 px-5">
      <BrandLabel className="z-20" />
      <HamburgerButton
        aria-label="toggle navigation menu"
        className="z-20 lg:hidden"
        isActive={navOpen}
        onClick={() => {
          setNavOpen((currentState) => !currentState);
        }}
      />
      <NavMenu isActive={navOpen} />
    </header>
  );
}
