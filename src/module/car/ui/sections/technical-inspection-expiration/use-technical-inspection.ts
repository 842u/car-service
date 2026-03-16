import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { getCarsByPage } from '@/lib/supabase/tables/cars';
import { queryKeys } from '@/lib/tanstack/keys';

export function useTechnicalInspectionExpirationSection() {
  const { addToast } = useToasts();

  const { data, isError, error, isPending } = useInfiniteQuery({
    throwOnError: false,
    queryKey: queryKeys.carsInfiniteByColumnOrder(
      'technical_inspection_expiration',
    ),
    queryFn: async ({ pageParam }) => {
      const { data, nextPageParam } = await getCarsByPage({
        pageParam,
        pageLimit: 3,
        orderBy: { column: 'technical_inspection_expiration', ascending: true },
      });

      return { data, nextPageParam };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPageParam,
  });

  useEffect(() => {
    isError &&
      addToast(
        error?.message || 'Cannot get technical inspection expiration data.',
        'error',
      );
  }, [isError, addToast, error]);

  return { data, isPending };
}
