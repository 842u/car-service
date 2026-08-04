import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { queryKeys as ownershipQueryKeys } from '@/car/ownership/presentation/tanstack/query/keys';
import { getOwnershipsByCarIdQueryOptions } from '@/car/ownership/presentation/tanstack/query/options';
import { useToasts } from '@/common/presentation/hook/use-toasts';
import { queryKeySerialize } from '@/common/presentation/tanstack/query-key-serialize';
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
    ownershipsError &&
      addToast(
        ownershipsError.message,
        'error',
        queryKeySerialize(ownershipQueryKeys.byCarId(carId)),
      );
  }, [addToast, ownershipsError, carId]);

  const isSessionUserPrimaryOwner = !!ownerships?.find(
    (ownership) => ownership.ownerId === sessionUser?.id && ownership.isPrimary,
  );

  return { isSessionUserPrimaryOwner };
}
