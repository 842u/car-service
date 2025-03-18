import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

import { useToasts } from '@/hooks/useToasts';
import { getCurrentSessionProfile } from '@/utils/supabase/general';

import { AvatarImage } from '../AvatarImage/AvatarImage';
import { Spinner } from '../Spinner/Spinner';

export const USER_BADGE_TEST_ID = 'user badge';

type UserBadgeProps = {
  className?: string;
};

export function UserBadge({ className }: UserBadgeProps) {
  const { addToast } = useToasts();

  const { data, error, isSuccess, isPending, isError } = useQuery({
    queryKey: ['profile', 'session'],
    queryFn: getCurrentSessionProfile,
  });

  useEffect(() => {
    isError && addToast(error.message, 'error');
  }, [isError, addToast, error]);

  return (
    <div
      className={twMerge('md:flex md:items-center md:gap-3', className)}
      data-testid={USER_BADGE_TEST_ID}
    >
      {isPending && (
        <Spinner className="fill-accent-400 stroke-accent-400 h-full" />
      )}
      {isSuccess && data && (
        <>
          <p className="hidden md:inline-block md:overflow-hidden">
            {data.username}
          </p>
          <AvatarImage
            className="border-alpha-grey-300 aspect-square h-full w-auto overflow-hidden rounded-full border"
            src={data.avatar_url}
          />
        </>
      )}
    </div>
  );
}
