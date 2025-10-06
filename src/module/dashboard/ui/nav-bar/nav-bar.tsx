'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { BrandLabel } from '@/ui/brand-label/brand-label';
import { Spinner } from '@/ui/decorative/spinner/spinner';
import { HamburgerButton } from '@/ui/hamburger-button/hamburger-button';
import { NavBar } from '@/ui/nav-bar/nav-bar';
import { getSessionUserQueryOptions } from '@/user/infrastructure/tanstack/query/options';
import { UserBadge } from '@/user/presentation/ui/badge/badge';

import { NavBarNav } from './nav/nav';

export function DashboardNavBar() {
  const [isActive, setIsActive] = useState(false);

  const handleHamburgerButtonClick = () => {
    setIsActive((currentState) => !currentState);
  };

  const handleNavClick = () => {
    if (isActive) {
      setIsActive(false);
    }
  };

  const { addToast } = useToasts();

  const { data, error, isPending, isSuccess } = useQuery(
    getSessionUserQueryOptions,
  );

  useEffect(() => {
    error && addToast(error.message, 'error');
  }, [addToast, error]);

  return (
    <NavBar>
      <BrandLabel className="z-10 h-full" />
      {isPending && (
        <Spinner className="fill-accent-400 stroke-accent-400 z-10 h-full" />
      )}
      {isSuccess && <UserBadge className="z-10" user={data} />}
      <HamburgerButton
        className="z-10 md:hidden"
        isActive={isActive}
        onClick={handleHamburgerButtonClick}
      />
      <NavBarNav isActive={isActive} onClick={handleNavClick} />
    </NavBar>
  );
}
