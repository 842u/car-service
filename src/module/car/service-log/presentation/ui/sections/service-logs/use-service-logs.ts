import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useOwnerProfilesForCar } from '@/car/ownership/presentation/hooks/use-owner-profiles-for-car';
import { getServiceLogsByCarIdQueryOptions } from '@/car/service-log/infrastructure/tanstack/query/options';
import { useToasts } from '@/common/presentation/hook/use-toasts';
import { useSessionUser } from '@/user/presentation/hooks/use-session-user';

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

    addToast(serviceLogsError.message, 'error');
  }, [addToast, serviceLogsError]);

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
