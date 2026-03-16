import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { getCarsOwnershipsByOwnerId } from '@/lib/supabase/tables/cars_ownerships';
import { queryKeys } from '@/lib/tanstack/keys';

interface UseTotalOwnershipsSectionParams {
  ownerId: string;
}

export function useTotalOwnershipsSection({
  ownerId,
}: UseTotalOwnershipsSectionParams) {
  const { addToast } = useToasts();

  const { data, error, isError, isPending } = useQuery({
    throwOnError: false,
    queryKey: queryKeys.carsOwnershipsByOwnerId(ownerId),
    queryFn: async () => await getCarsOwnershipsByOwnerId(ownerId),
    enabled: !!ownerId,
  });

  useEffect(() => {
    isError &&
      addToast(error?.message || 'Cannot get user ownerships.', 'error');
  }, [isError, addToast, error]);

  return {
    data,
    isPending,
  };
}
