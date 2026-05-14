import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { getCarOwnerships } from '@/lib/supabase/tables/cars_ownerships';
import { getServiceLogsByCarId } from '@/lib/supabase/tables/service_logs';
import { queryKeys } from '@/lib/tanstack/keys';
import { userDataSource } from '@/user/dependency/data-source';
import { queryKeys as userQueryKeys } from '@/user/infrastructure/tanstack/query/keys';
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

  const { data: users, error: usersError } = useQuery({
    throwOnError: false,
    queryKey: userQueryKeys.usersByContext({
      carId,
      ownershipsId: ownerships?.map((owner) => owner.owner_id) || [],
    }),
    queryFn: async () => {
      const usersResult = await userDataSource.getUsersByIds(
        ownerships?.map((owner) => owner.owner_id) || [],
      );

      if (!usersResult.success) {
        const { message } = usersResult.error;
        throw new Error(message);
      }

      return usersResult.data;
    },
    enabled: allowDependentQueries,
  });

  useEffect(() => {
    serviceLogsError && addToast(serviceLogsError.message, 'error');
  }, [addToast, serviceLogsError]);

  useEffect(() => {
    ownershipsError && addToast(ownershipsError.message, 'error');
  }, [addToast, ownershipsError]);

  useEffect(() => {
    usersError && addToast(usersError.message, 'error');
  }, [addToast, usersError]);

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
