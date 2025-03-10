import { useEffect, useState } from 'react';

import { Profile } from '@/types';
import { getProfile } from '@/utils/supabase/general';

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState<Profile>({
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
