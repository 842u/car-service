import { useInfiniteQuery, useIsMutating } from '@tanstack/react-query';
import { useEffect } from 'react';

import { queryKeys } from '@/car/presentation/tanstack/query/keys';
import { getCarsInfiniteQueryOptions } from '@/car/presentation/tanstack/query/options';
import { useInfiniteScrollTrigger } from '@/common/presentation/hook/use-infinite-scroll-trigger';
import { useToasts } from '@/common/presentation/hook/use-toasts';
import { queryKeySerialize } from '@/common/presentation/tanstack/query-key';

export function useCarsGallery() {
  const { addToast } = useToasts();

  const carsInfiniteIsMutating = useIsMutating({
    mutationKey: queryKeys.infinite(),
  });

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

  const intersectionTargetRef = useInfiniteScrollTrigger<HTMLDivElement>({
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isSuccess,
    fetchNextPage,
    threshold: 0.5,
  });

  useEffect(() => {
    isError &&
      addToast(error.message, 'error', queryKeySerialize(queryKeys.infinite()));
  }, [isError, addToast, error]);

  const carsData = data?.pages.flatMap((page) => page.data) || [];

  return {
    isPending,
    data: carsData,
    intersectionTargetRef,
    isFetchingNextPage,
  };
}
