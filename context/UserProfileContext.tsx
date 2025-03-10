import { createContext, Dispatch, SetStateAction } from 'react';

import { Profile } from '@/types';

export type UserProfileContextType = {
  userProfile: Profile;
  setUserProfile: Dispatch<SetStateAction<Profile>>;
};

export const UserProfileContext = createContext<UserProfileContextType>(
  {} as UserProfileContextType,
);
