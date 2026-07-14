import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import {
  getOwnerProfilesQueryOptions,
  getOwnershipsByCarIdQueryOptions,
} from '@/car/ownership/infrastructure/tanstack/query/options';
import { getServiceLogsByCarIdQueryOptions } from '@/car/service-log/infrastructure/tanstack/query/options';
import { queryKeySerialize } from '@/common/infrastructure/tanstack/query-key';
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

  const { data: ownerships, error: ownershipsError } = useQuery(
    getOwnershipsByCarIdQueryOptions(carId),
  );

  const allowDependentQueries = !!(ownerships && ownerships.length);

  const ownerProfilesQueryOptions = getOwnerProfilesQueryOptions({
    carId,
    ownerIds: ownerships?.map((ownership) => ownership.ownerId) || [],
  });

  const { data: users, error: usersError } = useQuery({
    ...ownerProfilesQueryOptions,
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
      queryKeySerialize(ownerProfilesQueryOptions.queryKey),
    );
  }, [addToast, usersError, ownerProfilesQueryOptions.queryKey]);

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
