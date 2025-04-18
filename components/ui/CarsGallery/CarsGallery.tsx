import {
  useInfiniteQuery,
  useIsMutating,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { useToasts } from '@/hooks/useToasts';
import { getCarsByPage } from '@/utils/supabase/tables/cars';
import { queryKeys } from '@/utils/tanstack/keys';

import { Spinner } from '../../decorative/Spinner/Spinner';
import { CarCard } from '../CarCard/CarCard';

export function CarsGallery() {
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
  return (
    <section aria-label="user's cars">
      {isError && <p>{error.message}</p>}
      {isPending && (
        <Spinner className="stroke-accent-400 fill-accent-400 h-16 md:h-20 lg:h-24" />
      )}
      {hasNoCars && (
        <p>
          <span className="block text-center">
            Currently, you don&apos;t have cars.{' '}
          </span>
          <span className="block text-center">Feel free to add one.</span>
        </p>
      )}
      {isSuccess && (
        <div className="relative flex flex-col gap-5 py-5 md:flex-row md:flex-wrap md:justify-center lg:max-w-[1920px]">
          {data.pages.map((page) => {
            return page.data.map(
              (car) => car && <CarCard key={car.id} car={car} />,
            );
          })}
          <div
            ref={intersectionTargetRef}
            className="absolute bottom-0 left-0 -z-10 h-[30vh] w-full"
          />
          {isFetchingNextPage && (
            <Spinner className="stroke-accent-400 fill-accent-400 my-10 h-16 w-full" />
          )}
        </div>
      )}
    </section>
  );
}
