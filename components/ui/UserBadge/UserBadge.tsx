/* eslint @typescript-eslint/naming-convention: 0 */

import { useContext } from 'react';

import { UserProfileContext } from '@/context/UserProfileContext';

import { Avatar } from '../Avatar/Avatar';

export function UserBadge() {
  const {
    userProfile: { username, avatar_url },
  } = useContext(UserProfileContext);

  return (
    <div className="z-10 p-2 md:flex md:items-center md:justify-center md:gap-2 md:overflow-hidden">
      <p className="hidden md:block md:overflow-hidden">{username}</p>
      <Avatar className="aspect-square h-full w-auto" src={avatar_url || ''} />
    </div>
  );
}
