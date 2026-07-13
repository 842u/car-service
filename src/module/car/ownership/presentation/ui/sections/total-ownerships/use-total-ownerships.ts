import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getOwnershipsByOwnerIdQueryOptions } from '@/car/ownership/infrastructure/tanstack/query/options';
import { useToasts } from '@/common/presentation/hook/use-toasts';
import { useSessionUser } from '@/user/presentation/hooks/use-session-user';

export function useTotalOwnershipsSection() {
  const { addToast } = useToasts();

  const { data: userData } = useSessionUser();

  const {
    data: ownershipsData,
    error: ownershipsError,
    isError: ownershipsIsError,
    isPending: ownershipsIsPending,
  } = useQuery(getOwnershipsByOwnerIdQueryOptions(userData?.id));

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
