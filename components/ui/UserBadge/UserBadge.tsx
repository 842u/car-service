import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useToasts } from '@/hooks/useToasts';
import { getProfile } from '@/utils/supabase/general';

import { Avatar } from '../Avatar/Avatar';
import { Spinner } from '../Spinner/Spinner';

export const USER_BADGE_TEST_ID = 'user badge';

export function UserBadge() {
  const { addToast } = useToasts();

  const { data, error, isSuccess, isPending, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  useEffect(() => {
    isError && addToast(error.message, 'error');
  }, [isError, addToast, error]);

  return (
    <div
      className="z-10 p-2 md:flex md:items-center md:justify-center md:gap-2 md:overflow-hidden"
      data-testid={USER_BADGE_TEST_ID}
    >
      {isPending && (
        <Spinner className="fill-accent-400 stroke-accent-400 h-full" />
      )}
      {isSuccess && data && (
        <>
          <p className="hidden md:block md:overflow-hidden">{data.username}</p>
          <Avatar
            className="aspect-square h-full w-auto"
            src={data.avatar_url || ''}
          />
        </>
      )}
    </div>
  );
}
