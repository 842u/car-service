import { useEffect, useState } from 'react';

import { UserProfile } from '@/types';
import { fetchUserProfile } from '@/utils/supabase/general';

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    avatar_url: null,
    id: '',
    username: null,
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
