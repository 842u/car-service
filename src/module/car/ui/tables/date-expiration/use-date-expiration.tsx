import { useInfiniteQuery } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import { useEffect, useMemo, useRef } from 'react';

import { CarBadge } from '@/car/ui/badge/badge';
import { DateExpirationTableViewButton } from '@/car/ui/tables/date-expiration/view-button/view-button';
import { useToasts } from '@/common/presentation/hook/use-toasts';
import { getCarsByPage } from '@/lib/supabase/tables/cars';
import { queryKeys } from '@/lib/tanstack/keys';
import type { Car } from '@/types';
import { DateExpirationStatusIcon } from '@/ui/date-expiration-status-icon/date-expiration-status-icon';

const columnsHelper = createColumnHelper<Car>();

interface UseDateExpirationTableParams {
  label: string;
  dateColumn: keyof Pick<
    Car,
    'created_at' | 'insurance_expiration' | 'technical_inspection_expiration'
  >;
}

export function useDateExpirationTable({
  label,
  dateColumn,
}: UseDateExpirationTableParams) {
  const intersectionTargetRef = useRef<HTMLTableRowElement>(null);

  const columns = useMemo(
    () =>
      [
        columnsHelper.display({
          id: 'status',
          cell: ({ row }) => {
            const date = row.original[dateColumn];

            if (!date) return;

            return (
              <DateExpirationStatusIcon
                className="h-full"
                date={date}
                label={label}
              />
            );
          },
        }),
        columnsHelper.accessor(dateColumn, {
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
              <div className="max-w-40 overflow-auto">
                <CarBadge
                  className="h-10 flex-row-reverse justify-end"
                  imageUrl={image_url}
                  name={custom_name}
                />
              </div>
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
        columnsHelper.display({
          id: 'actions',
          cell: ({ row }) => (
            <DateExpirationTableViewButton carId={row.original.id} />
          ),
        }),
      ] as ColumnDef<Car>[],
    [dateColumn, label],
  );

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
    queryKey: queryKeys.carsInfiniteByColumnOrder(dateColumn),
    queryFn: async ({ pageParam }) => {
      const { data, nextPageParam } = await getCarsByPage({
        pageParam,
        pageLimit: 6,
        orderBy: { column: dateColumn, ascending: true },
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
        error?.message ||
          `Cannot get cars ${label.toLowerCase()} expiration data.`,
        'error',
      );
  }, [isError, addToast, error, label]);

  const tableData = data?.pages.flatMap((page) => page.data) || [];

  return {
    columns,
    data: tableData,
    isPending,
    intersectionTargetRef,
  };
}
