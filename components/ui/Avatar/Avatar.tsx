'use client';

import Image from 'next/image';
import { useContext } from 'react';

import { UserIcon } from '@/components/decorative/icons/UserIcon';
import { UserProfileContext } from '@/context/UserProfileContext';

export function Avatar() {
  const userProfile = useContext(UserProfileContext);

  return (
    <div className="relative h-24 w-24 rounded-full border-2 border-alpha-grey-300">
      {userProfile?.avatar_url ? (
        <Image
          fill
          alt="user avatar"
          className="rounded-full"
          src={userProfile.avatar_url}
        />
      ) : (
        <UserIcon className="stroke-alpha-grey-500 stroke-2" />
      )}
    </div>
  );
}
