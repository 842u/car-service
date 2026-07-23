import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import {
  getOwnerProfilesQueryOptions,
  getOwnershipsByCarIdQueryOptions,
} from '@/car/ownership/presentation/tanstack/query/options';
import { useToasts } from '@/common/presentation/hook/use-toasts';
import { queryKeySerialize } from '@/common/presentation/tanstack/query-key';

export function useOwnerProfilesForCar(carId: string) {
  const { addToast } = useToasts();

  const {
    data: ownerships,
    error: ownershipsError,
    isLoading: ownershipsLoading,
  } = useQuery(getOwnershipsByCarIdQueryOptions(carId));

  const allowDependentQueries = !!(ownerships && ownerships.length);

  const ownerProfilesQueryOptions = getOwnerProfilesQueryOptions({
    carId,
    ownerIds: ownerships?.map((ownership) => ownership.ownerId) || [],
  });

  const {
    data: users,
    error: usersError,
    isLoading: usersLoading,
  } = useQuery({
    ...ownerProfilesQueryOptions,
    enabled: allowDependentQueries,
  });

  useEffect(() => {
    if (!ownershipsError) return;

    addToast(ownershipsError.message, 'error');
  }, [ownershipsError, addToast]);

  useEffect(() => {
    if (!usersError) return;

    addToast(
      usersError.message,
      'error',
      queryKeySerialize(ownerProfilesQueryOptions.queryKey),
    );
  }, [usersError, addToast, ownerProfilesQueryOptions.queryKey]);

  return {
    ownerships,
    users,
    isLoading: ownershipsLoading || usersLoading,
  };
}
