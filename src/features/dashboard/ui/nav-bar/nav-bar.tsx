'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { useToasts } from '@/common/hooks/use-toasts';
import { BrandLabel } from '@/ui/brand-label/brand-label';
import { Spinner } from '@/ui/decorative/spinner-tempname/spinner-tempname';
import { HamburgerButton } from '@/ui/hamburger-button/hamburger-button';
import { NavBar as BaseNavBar } from '@/ui/nav-bar/nav-bar';
import { UserBadge } from '@/user/ui/user-badge/user-badge';
import { getCurrentSessionProfile } from '@/utils/supabase/tables/profiles';
import { queryKeys } from '@/utils/tanstack/keys';

import { Nav } from './nav/nav';

export function NavBar() {
  const [isActive, setIsActive] = useState(false);

  const hamburgerButtonClickHandler = () => {
    setIsActive((currentState) => !currentState);
  };

  const navMenuClickHandler = () => {
    if (isActive) {
      setIsActive(false);
    }
  };

  const { addToast } = useToasts();

  const { data, error, isPending, isSuccess } = useQuery({
    throwOnError: false,
    queryKey: queryKeys.profilesCurrentSession,
    queryFn: getCurrentSessionProfile,
  });

  useEffect(() => {
    error && addToast(error.message, 'error');
  }, [addToast, error]);

  return (
    <BaseNavBar>
      <BrandLabel className="z-10 h-full" />
      {isPending && (
        <Spinner className="fill-accent-400 stroke-accent-400 z-10 h-full" />
      )}
      {isSuccess && <UserBadge className="z-10" userProfile={data} />}
      <HamburgerButton
        className="z-10 md:hidden"
        isActive={isActive}
        onClick={hamburgerButtonClickHandler}
      />
      <Nav isActive={isActive} onClick={navMenuClickHandler} />
    </BaseNavBar>
  );
}
