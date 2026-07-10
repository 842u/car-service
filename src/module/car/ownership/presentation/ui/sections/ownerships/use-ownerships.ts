import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import {
  getOwnerProfilesQueryOptions,
  getOwnershipsByCarIdQueryOptions,
} from '@/car/ownership/infrastructure/tanstack/query/options';
import { useToasts } from '@/common/presentation/hook/use-toasts';
import { queryKeySerialize } from '@/lib/tanstack/utils';
import { useSessionUser } from '@/user/presentation/hooks/use-session-user';

interface UseOwnershipsSectionParams {
  carId: string;
}

export function useOwnershipsSection({ carId }: UseOwnershipsSectionParams) {
  const { data: sessionUser } = useSessionUser();

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
    ownerships,
    users,
    isSessionUserPrimaryOwner,
    sessionUserId: sessionUser?.id,
    isLoading: ownershipsLoading || usersLoading,
  };
}
