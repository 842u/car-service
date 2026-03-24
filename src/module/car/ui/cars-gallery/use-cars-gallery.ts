import {
  useInfiniteQuery,
  useIsMutating,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { getCarsByPage } from '@/lib/supabase/tables/cars';
import { queryKeys } from '@/lib/tanstack/keys';

export function useCarsGallery() {
  const intersectionTargetRef = useRef<HTMLDivElement>(null);

  const { addToast } = useToasts();

  const carsInfiniteIsMutating = useIsMutating({
    mutationKey: queryKeys.carsInfinite,
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
    queryKey: queryKeys.carsInfinite,
    queryFn: async ({ pageParam }) => await getCarsByPage({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPageParam,
  });

  useEffect(() => {
    data?.pages
      .flatMap((page) => page.data)
      .forEach((car) => car && queryClient.setQueryData(['cars', car.id], car));
  }, [data, queryClient]);

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

  const carsData = data?.pages.flatMap((page) => page.data) || [];

  return {
    isPending,
    data: carsData,
    intersectionTargetRef,
    isFetchingNextPage,
  };
}
