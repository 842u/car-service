import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getOwnershipsByCarIdQueryOptions } from '@/car/ownership/infrastructure/tanstack/query/options';
import { useToasts } from '@/common/presentation/hook/use-toasts';
import { useSessionUser } from '@/user/presentation/hooks/use-session-user';

interface UseDeleteSectionParams {
  carId: string;
}

export function useDeleteSection({ carId }: UseDeleteSectionParams) {
  const { data: sessionUser } = useSessionUser();

  const { addToast } = useToasts();

  const { data: ownerships, error: ownershipsError } = useQuery(
    getOwnershipsByCarIdQueryOptions(carId),
  );

  useEffect(() => {
    ownershipsError && addToast(ownershipsError.message, 'error');
  }, [addToast, ownershipsError]);

  const isSessionUserPrimaryOwner = !!ownerships?.find(
    (ownership) => ownership.ownerId === sessionUser?.id && ownership.isPrimary,
  );

  return { isSessionUserPrimaryOwner };
}
