'use client';

import { ReactNode, useMemo } from 'react';

import { UserProfileContext } from '@/context/UserProfileContext';
import { useUserProfile } from '@/hooks/useUserProfile';

type UserProfileProviderProps = {
  children: ReactNode;
};

export function UserProfileProvider({ children }: UserProfileProviderProps) {
  const { userProfile, setUserProfile } = useUserProfile();

  const value = useMemo(
    () => ({ userProfile, setUserProfile }),
    [userProfile, setUserProfile],
  );

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}
