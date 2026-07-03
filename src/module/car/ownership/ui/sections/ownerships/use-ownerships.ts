import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { getCarOwnerships } from '@/lib/supabase/tables/cars_ownerships';
import { queryKeys } from '@/lib/tanstack/keys';
import { queryKeySerialize } from '@/lib/tanstack/utils';
import { getCarOwnersQueryOptions } from '@/user/infrastructure/tanstack/query/options';
import { useSessionUser } from '@/user/presentation/hooks/use-session-user';

interface UseOwnershipsSectionParams {
  carId: string;
}

export function useOwnershipsSection({ carId }: UseOwnershipsSectionParams) {
  const sessionUser = useSessionUser();

  const { addToast } = useToasts();

  const {
    data: ownerships,
    error: ownershipsError,
    isLoading: ownershipsLoading,
  } = useQuery({
    throwOnError: false,
    queryKey: queryKeys.carsOwnershipsByCarId(carId),
    queryFn: () => getCarOwnerships(carId),
  });

  const allowDependentQueries = !!(ownerships && ownerships.length);

  const carOwnersQueryOptions = getCarOwnersQueryOptions({
    carId,
    ownerIds: ownerships?.map((owner) => owner.owner_id) || [],
  });

  const {
    data: users,
    error: usersError,
    isLoading: usersLoading,
  } = useQuery({
    ...carOwnersQueryOptions,
    enabled: allowDependentQueries,
  });

  useEffect(() => {
    if (!ownershipsError) return;

    addToast(ownershipsError.message, 'error');
  }, [addToast, ownershipsError]);

  useEffect(() => {
    if (!usersError) return;

    addToast(
      usersError.message,
      'error',
      queryKeySerialize(carOwnersQueryOptions.queryKey),
    );
  }, [addToast, usersError, carOwnersQueryOptions.queryKey]);

  const isSessionUserPrimaryOwner = !!ownerships?.find(
    (ownership) =>
      ownership.owner_id === sessionUser?.id && ownership.is_primary_owner,
  );

  return {
    ownerships,
    users,
    isSessionUserPrimaryOwner,
    sessionUserId: sessionUser?.id,
    isLoading: ownershipsLoading || usersLoading,
  };
}
