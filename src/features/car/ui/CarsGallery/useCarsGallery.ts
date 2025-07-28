import {
  useInfiniteQuery,
  useIsMutating,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { useToasts } from '@/features/common/hooks/use-toasts';
import { getCarsByPage } from '@/utils/supabase/tables/cars';
import { queryKeys } from '@/utils/tanstack/keys';

export function useCarsGallery() {
  const intersectionTargetRef = useRef<HTMLDivElement>(null);

  const { addToast } = useToasts();

  const carsInfiniteIsMutating = useIsMutating({
    mutationKey: queryKeys.infiniteCars,
  });

  const queryClient = useQueryClient();

  const {
    data,
    error,
    hasNextPage,
    isPending,
    isError,
    isSuccess,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    throwOnError: false,
    enabled: !carsInfiniteIsMutating,
    queryKey: queryKeys.infiniteCars,
    queryFn: async ({ pageParam }) => {
      const { data, nextPageParam } = await getCarsByPage({ pageParam });

      data.map((car) => queryClient.setQueryData(['cars', car.id], car));

      return { data, nextPageParam };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPageParam,
  });

  useEffect(() => {
    if (!intersectionTargetRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          isSuccess && !isFetching && !isFetchingNextPage && fetchNextPage();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(intersectionTargetRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, isSuccess]);

  useEffect(() => {
    isError && addToast(error.message, 'error');
  }, [isError, addToast, error]);

  const hasNoCars = isSuccess && data.pages[0].data.length === 0;

  return {
    isError,
    isPending,
    isSuccess,
    error,
    hasNoCars,
    data,
    intersectionTargetRef,
    isFetchingNextPage,
  };
}
