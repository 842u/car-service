import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { getCarOwnerships } from '@/lib/supabase/tables/cars_ownerships';
import { queryKeys } from '@/lib/tanstack/keys';
import { useSessionUser } from '@/user/presentation/hooks/use-session-user';

interface UseDeleteSectionParams {
  carId: string;
}

export function useDeleteSection({ carId }: UseDeleteSectionParams) {
  const sessionUser = useSessionUser();

  const { addToast } = useToasts();

  const { data: ownerships, error: ownershipsError } = useQuery({
    throwOnError: false,
    queryKey: queryKeys.carsOwnershipsByCarId(carId),
    queryFn: () => getCarOwnerships(carId),
  });

  useEffect(() => {
    ownershipsError && addToast(ownershipsError.message, 'error');
  }, [addToast, ownershipsError]);

  const isSessionUserPrimaryOwner = !!ownerships?.find(
    (ownership) =>
      ownership.owner_id === sessionUser?.id && ownership.is_primary_owner,
  );

  return { isSessionUserPrimaryOwner };
}
