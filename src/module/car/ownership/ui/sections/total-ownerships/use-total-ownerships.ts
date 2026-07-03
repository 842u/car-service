import { skipToken, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { getCarsOwnershipsByOwnerId } from '@/lib/supabase/tables/cars_ownerships';
import { queryKeys } from '@/lib/tanstack/keys';
import { useSessionUser } from '@/user/presentation/hooks/use-session-user';

export function useTotalOwnershipsSection() {
  const { addToast } = useToasts();

  const { data: userData } = useSessionUser();

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
    if (!ownershipsIsError) return;

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
