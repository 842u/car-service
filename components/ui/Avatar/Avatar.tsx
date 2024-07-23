'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { getBrowserClient } from '@/utils/supabase';

function AvatarSkeleton() {
  return (
    <div className="h-full w-full overflow-hidden rounded-full bg-alpha-grey-500" />
  );
}

export function Avatar() {
  const [avatarUrl, setAvatarUrl] = useState('');

  const fetchData = async () => {
    const supabase = getBrowserClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', user?.id || '');

    if (data) {
      setAvatarUrl(data[0].avatar_url || '');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="relative h-24 w-24 rounded-full border-2 border-alpha-grey-300">
      {avatarUrl === '' ? (
        <AvatarSkeleton />
      ) : (
        <Image
          fill
          alt="user avatar"
          className="rounded-full"
          src={avatarUrl}
        />
      )}
    </div>
  );
}
