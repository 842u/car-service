import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useOwnerProfilesForCar } from '@/car/ownership/presentation/hook/use-owner-profiles-for-car';
import { queryKeys } from '@/car/service-log/presentation/tanstack/query/keys';
import { getServiceLogsByCarIdQueryOptions } from '@/car/service-log/presentation/tanstack/query/options';
import { useToasts } from '@/common/presentation/hook/use-toasts';
import { queryKeySerialize } from '@/common/presentation/tanstack/query-key-serialize';
import { useSessionUser } from '@/user/presentation/hook/use-session-user';

interface UseServiceLogsSectionParams {
  carId: string;
}

export function useServiceLogsSection({ carId }: UseServiceLogsSectionParams) {
  const { data: sessionUser } = useSessionUser();

  const { addToast } = useToasts();

  const {
    data: serviceLogs,
    error: serviceLogsError,
    isLoading,
  } = useQuery(getServiceLogsByCarIdQueryOptions(carId));

  const { ownerships, users } = useOwnerProfilesForCar(carId);

  useEffect(() => {
    if (!serviceLogsError) return;

    addToast(
      serviceLogsError.message,
      'error',
      queryKeySerialize(queryKeys.byCarId(carId)),
    );
  }, [addToast, serviceLogsError, carId]);

  const isSessionUserPrimaryOwner = !!ownerships?.find(
    (ownership) => ownership.ownerId === sessionUser?.id && ownership.isPrimary,
  );

  return {
    serviceLogs,
    users,
    isSessionUserPrimaryOwner,
    sessionUserId: sessionUser?.id,
    isLoading,
  };
}
