import { createContext } from 'react';

import { UserProfile } from '@/types';

export type UserProfileContextType = UserProfile | null;

export const UserProfileContext = createContext<UserProfileContextType>(null);
