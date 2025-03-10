import { useEffect, useState } from 'react';

import { UserProfile } from '@/types';
import { getProfile } from '@/utils/supabase/general';

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    avatar_url: null,
    id: '',
    username: null,
  });

  useEffect(() => {
    (async () => {
      const profileData = await getProfile();

      setUserProfile((previousState) => ({
        ...previousState,
        ...profileData,
      }));
    })();
  }, []);

  return { userProfile, setUserProfile };
}
