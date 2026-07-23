import {
  useInfiniteQuery,
  useIsMutating,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect } from 'react';

import { queryKeys } from '@/car/presentation/tanstack/query/keys';
import { getCarsInfiniteQueryOptions } from '@/car/presentation/tanstack/query/options';
import { useInfiniteScrollTrigger } from '@/common/presentation/hook/use-infinite-scroll-trigger';
import { useToasts } from '@/common/presentation/hook/use-toasts';

export function useCarsGallery() {
  const { addToast } = useToasts();

  const carsInfiniteIsMutating = useIsMutating({
    mutationKey: queryKeys.infinite(),
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
    ...getCarsInfiniteQueryOptions(),
    enabled: !carsInfiniteIsMutating,
  });

  useEffect(() => {
    data?.pages
      .flatMap((page) => page.data)
      .forEach(
        (car) => car && queryClient.setQueryData(queryKeys.byId(car.id), car),
      );
  }, [data, queryClient]);

  const intersectionTargetRef = useInfiniteScrollTrigger<HTMLDivElement>({
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isSuccess,
    fetchNextPage,
    threshold: 0.5,
  });

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
