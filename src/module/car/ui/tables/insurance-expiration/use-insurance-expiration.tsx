import { useInfiniteQuery } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import { useEffect, useRef } from 'react';

import { CarBadge } from '@/car/ui/badge/badge';
import { useToasts } from '@/common/presentation/hook/use-toasts';
import { getCarsByPage } from '@/lib/supabase/tables/cars';
import { queryKeys } from '@/lib/tanstack/keys';
import type { Car } from '@/types';
import { DateExpirationStatusIcon } from '@/ui/date-expiration-status-icon/date-expiration-status-icon';

const columnsHelper = createColumnHelper<Car>();

const columns = [
  columnsHelper.display({
    id: 'status',
    cell: ({ row }) => {
      const { insurance_expiration } = row.original;

      if (!insurance_expiration) return;

      return (
        <DateExpirationStatusIcon
          className="h-full"
          date={insurance_expiration}
          label="Insurance"
        />
      );
    },
  }),
  columnsHelper.accessor('insurance_expiration', {
    meta: {
      label: 'Expiration Date',
    },
  }),
  columnsHelper.accessor('id', {
    meta: {
      label: 'Car',
    },
    id: 'id',
    cell: ({ row }) => {
      const { custom_name, image_url } = row.original;

      return (
        <CarBadge
          className="h-10 flex-row-reverse justify-end"
          imageUrl={image_url}
          name={custom_name}
        />
      );
    },
  }),
  columnsHelper.accessor('license_plates', {
    meta: {
      label: 'License plates',
    },
  }),
  columnsHelper.accessor('vin', {
    meta: {
      label: 'VIN',
      shouldSpan: true,
    },
  }),
] as ColumnDef<Car>[];

export function useInsuranceExpirationTable() {
  const intersectionTargetRef = useRef<HTMLTableRowElement>(null);

  const { addToast } = useToasts();

  const {
    data,
    isError,
    error,
    isPending,
    isSuccess,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    throwOnError: false,
    queryKey: queryKeys.carsInfiniteByColumnOrder('insurance_expiration'),
    queryFn: async ({ pageParam }) => {
      const { data, nextPageParam } = await getCarsByPage({
        pageParam,
        pageLimit: 6,
        orderBy: { column: 'insurance_expiration', ascending: true },
      });

      return { data, nextPageParam };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPageParam,
  });

  useEffect(() => {
    const target = intersectionTargetRef.current;
    if (!target || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          isSuccess && !isFetching && !isFetchingNextPage && fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, isSuccess]);

  useEffect(() => {
    isError &&
      addToast(
        error?.message || 'Cannot get insurance expiration data.',
        'error',
      );
  }, [isError, addToast, error]);

  const tableData = data?.pages.flatMap((page) => page.data) || [];

  return {
    columns,
    data: tableData,
    isPending,
    intersectionTargetRef,
  };
}
