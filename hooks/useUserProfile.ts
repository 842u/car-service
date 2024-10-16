import { useEffect, useState } from 'react';

import { UserProfile } from '@/types';
import { fetchUserProfile } from '@/utils/general';

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    avatar_url: '',
    id: '',
    username: '',
  });

  useEffect(() => {
    (async () => {
      const profileData = await fetchUserProfile();

      setUserProfile((previousState) => ({
        ...previousState,
        ...profileData,
      }));
    })();
  }, []);

  return { userProfile, setUserProfile };
}
