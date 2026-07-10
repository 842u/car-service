import {
  useInfiniteQuery,
  useIsMutating,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { queryKeys } from '@/car/infrastructure/tanstack/query/keys';
import { getCarsInfiniteQueryOptions } from '@/car/infrastructure/tanstack/query/options';
import { useToasts } from '@/common/presentation/hook/use-toasts';

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
    ...getCarsInfiniteQueryOptions(),
    enabled: !carsInfiniteIsMutating,
  });

  useEffect(() => {
    data?.pages
      .flatMap((page) => page.data)
      .forEach(
        (car) =>
          car && queryClient.setQueryData(queryKeys.carsByCarId(car.id), car),
      );
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
