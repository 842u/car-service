import { createContext, Dispatch, SetStateAction } from 'react';

import { UserProfile } from '@/types';

export type UserProfileContextType = {
  userProfile: UserProfile;
  setUserProfile: Dispatch<SetStateAction<UserProfile>>;
};

export const UserProfileContext = createContext<UserProfileContextType>(
  {} as UserProfileContextType,
);
