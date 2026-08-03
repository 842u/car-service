import { useQueries, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { queryKeys } from '@/car/ownership/presentation/tanstack/query/keys';
import { getOwnershipsByCarIdQueryOptions } from '@/car/ownership/presentation/tanstack/query/options';
import { useToasts } from '@/common/presentation/hook/use-toasts';
import { queryKeySerialize } from '@/common/presentation/tanstack/query-key';
import { getUserByIdQueryOptions } from '@/user/presentation/tanstack/query/options';

export function useOwnerProfilesForCar(carId: string) {
  const { addToast } = useToasts();

  const {
    data: ownerships,
    error: ownershipsError,
    isLoading: ownershipsLoading,
  } = useQuery(getOwnershipsByCarIdQueryOptions(carId));

  const ownerIds = ownerships?.map((ownership) => ownership.ownerId) || [];

  const {
    users,
    isLoading: usersLoading,
    failedCount,
  } = useQueries({
    queries: ownerIds.map((ownerId) => getUserByIdQueryOptions(ownerId)),
    combine: (results) => ({
      users: results.flatMap((result) => (result.data ? [result.data] : [])),
      isLoading: results.some((result) => result.isLoading),
      failedCount: results.filter((result) => result.isError).length,
    }),
  });

  useEffect(() => {
    if (!ownershipsError) return;

    addToast(
      ownershipsError.message,
      'error',
      queryKeySerialize(queryKeys.byCarId(carId)),
    );
  }, [ownershipsError, addToast, carId]);

  useEffect(() => {
    if (!failedCount) return;

    addToast(
      `Cannot load ${failedCount} owner profile(s).`,
      'error',
      `owner-profiles-${carId}`,
    );
  }, [failedCount, carId, addToast]);

  return {
    ownerships,
    users,
    isLoading: ownershipsLoading || usersLoading,
  };
}
