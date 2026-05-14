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
  const { addToast } = useToasts();

  const intersectionTargetRef = useRef<HTMLTableRowElement>(null);

  const columns = useMemo(
    () =>
      [
        columnsHelper.display({
          id: 'status',
          cell: ({ row }) => {
            const date = row.original[dateColumn];
            return date ? (
              <DateExpirationStatusIcon
                className="aspect-square h-full p-0.5"
                date={date}
                label={label}
              />
            ) : null;
          },
        }),
        columnsHelper.accessor(dateColumn, {
          meta: { label: 'Expiration Date' },
        }),
        columnsHelper.accessor('id', {
          id: 'id',
          meta: { label: 'Car' },
          cell: ({ row }) => {
            const { custom_name, image_url } = row.original;
            return (
              <div className="max-w-32">
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
          meta: { label: 'License plates' },
        }),
        columnsHelper.accessor('vin', {
          meta: { label: 'VIN', shouldSpan: true },
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

  const {
    data,
    isError,
    error,
    isLoading,
    isFetching,
    isFetchingNextPage,
    isSuccess,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: queryKeys.carsInfiniteByColumnOrder(dateColumn),
    initialPageParam: 0,
    throwOnError: false,
    queryFn: async ({ pageParam }) => {
      const result = await getCarsByPage({
        pageParam,
        pageLimit: 6,
        orderBy: { column: dateColumn, ascending: true },
      });

      return result;
    },
    getNextPageParam: (lastPage) => lastPage.nextPageParam,
  });

  const tableData = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data],
  );

  useEffect(() => {
    const target = intersectionTargetRef.current;
    if (!target || !hasNextPage) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (
        entry.isIntersecting &&
        isSuccess &&
        !isFetching &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    });

    observer.observe(target);

    return () => observer.disconnect();
  }, [hasNextPage, isSuccess, isFetching, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (!isError) return;

    addToast(
      error?.message ||
        `Cannot get cars ${label.toLowerCase()} expiration data.`,
      'error',
    );
  }, [isError, error, label, addToast]);

  return {
    columns,
    data: tableData,
    isLoading,
    intersectionTargetRef: intersectionTargetRef,
  };
}
