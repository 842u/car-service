import { useEffect, useState } from 'react';

import { UserProfile } from '@/types';
import { getBrowserClient } from '@/utils/supabase';

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const supabase = getBrowserClient();

    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id || '');

      supabase.auth.onAuthStateChange(() => {
        setUserProfile(profileData?.[0] || null);
      });
    })();
  }, []);

  return userProfile;
}
