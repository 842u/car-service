'use client';

import { ReactNode } from 'react';

import { UserProfileContext } from '@/context/UserProfileContext';
import { useUserProfile } from '@/hooks/useUserProfile';

type UserProfileProviderProps = {
  children: ReactNode;
};

export function UserProfileProvider({ children }: UserProfileProviderProps) {
  const userProfile = useUserProfile();

  return (
    <UserProfileContext.Provider value={userProfile}>
      {children}
    </UserProfileContext.Provider>
  );
}
