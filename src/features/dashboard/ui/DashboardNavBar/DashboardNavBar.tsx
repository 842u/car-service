'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { useToasts } from '@/features/common/hooks/use-toasts';
import { BrandLabel } from '@/features/common/ui/brand-label/brand-label';
import { Spinner } from '@/features/common/ui/decorative/spinner/spinner';
import { UserBadge } from '@/features/user/ui/UserBadge/UserBadge';
import { getCurrentSessionProfile } from '@/utils/supabase/tables/profiles';
import { queryKeys } from '@/utils/tanstack/keys';

import { NavBar } from '../../../../features/common/ui/NavBar/NavBar';
import { HamburgerButton } from '../../../common/ui/hamburger-button/hamburger-button';
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
    <NavBar>
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
      <DashboardNavMenu isActive={isActive} onClick={navMenuClickHandler} />
    </NavBar>
  );
}
