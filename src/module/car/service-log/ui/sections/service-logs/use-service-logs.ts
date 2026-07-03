import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { getCarOwnerships } from '@/lib/supabase/tables/cars_ownerships';
import { getServiceLogsByCarId } from '@/lib/supabase/tables/service_logs';
import { queryKeys } from '@/lib/tanstack/keys';
import { queryKeySerialize } from '@/lib/tanstack/utils';
import { getCarOwnersQueryOptions } from '@/user/infrastructure/tanstack/query/options';
import { useSessionUser } from '@/user/presentation/hooks/use-session-user';

interface UseServiceLogsSectionParams {
  carId: string;
}

export function useServiceLogsSection({ carId }: UseServiceLogsSectionParams) {
  const sessionUser = useSessionUser();

  const { addToast } = useToasts();

  const {
    data: serviceLogs,
    error: serviceLogsError,
    isLoading,
  } = useQuery({
    throwOnError: false,
    queryKey: queryKeys.serviceLogsByCarId(carId),
    queryFn: () => getServiceLogsByCarId(carId),
  });

  const { data: ownerships, error: ownershipsError } = useQuery({
    throwOnError: false,
    queryKey: queryKeys.carsOwnershipsByCarId(carId),
    queryFn: () => getCarOwnerships(carId),
  });

  const allowDependentQueries = !!(ownerships && ownerships.length);

  const carOwnersQueryOptions = getCarOwnersQueryOptions({
    carId,
    ownerIds: ownerships?.map((owner) => owner.owner_id) || [],
  });

  const { data: users, error: usersError } = useQuery({
    ...carOwnersQueryOptions,
    enabled: allowDependentQueries,
  });

  useEffect(() => {
    if (!serviceLogsError) return;

    addToast(serviceLogsError.message, 'error');
  }, [addToast, serviceLogsError]);

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
    serviceLogs,
    users,
    isSessionUserPrimaryOwner,
    sessionUserId: sessionUser?.id,
    isLoading,
  };
}
