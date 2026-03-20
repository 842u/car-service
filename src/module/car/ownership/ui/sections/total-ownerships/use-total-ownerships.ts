import { skipToken, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { getCarsOwnershipsByOwnerId } from '@/lib/supabase/tables/cars_ownerships';
import { queryKeys } from '@/lib/tanstack/keys';
import { getSessionUserQueryOptions } from '@/user/infrastructure/tanstack/query/options';

export function useTotalOwnershipsSection() {
  const { addToast } = useToasts();

  const {
    data: userData,
    error: userError,
    isError: userIsError,
  } = useQuery(getSessionUserQueryOptions);

  const {
    data: ownershipsData,
    error: ownershipsError,
    isError: ownershipsIsError,
    isPending: ownershipsIsPending,
  } = useQuery({
    throwOnError: false,
    queryKey: queryKeys.carsOwnershipsByOwnerId(userData?.id),
    queryFn: userData?.id
      ? async () => await getCarsOwnershipsByOwnerId(userData.id)
      : skipToken,
  });

  useEffect(() => {
    userIsError && addToast(userError.message, 'error');
  }, [userIsError, addToast, userError]);

  useEffect(() => {
    ownershipsIsError &&
      addToast(
        ownershipsError?.message || 'Cannot get user ownerships.',
        'error',
      );
  }, [ownershipsIsError, addToast, ownershipsError]);

  return {
    data: ownershipsData,
    isPending: ownershipsIsPending,
  };
}
