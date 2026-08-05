import { useInfiniteQuery, useIsMutating } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import { useEffect, useMemo } from 'react';

import type { CarDto } from '@/car/application/dto/car';
import type { CarDateColumn } from '@/car/presentation/tanstack/query/keys';
import { queryKeys } from '@/car/presentation/tanstack/query/keys';
import { getCarsInfiniteQueryOptions } from '@/car/presentation/tanstack/query/options';
import { CarBadge } from '@/car/presentation/ui/badge/badge';
import { DateExpirationTableViewButton } from '@/car/presentation/ui/tables/date-expiration/view-button/view-button';
import { useInfiniteScrollTrigger } from '@/common/presentation/hook/use-infinite-scroll-trigger';
import { useToasts } from '@/common/presentation/hook/use-toasts';
import { queryKeySerialize } from '@/common/presentation/tanstack/query-key-serialize';
import { DateExpirationStatusIcon } from '@/ui/date-expiration-status-icon/date-expiration-status-icon';

const columnsHelper = createColumnHelper<CarDto>();

type UseDateExpirationTableParams = {
  label: string;
  dateColumn: CarDateColumn;
};

export function useDateExpirationTable({
  label,
  dateColumn,
}: UseDateExpirationTableParams) {
  const { addToast } = useToasts();

  const carsInfiniteIsMutating = useIsMutating({
    mutationKey: queryKeys.infinite(),
  });

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
            const { customName, imageUrl } = row.original;
            return (
              <div className="max-w-32">
                <CarBadge
                  className="h-10 flex-row-reverse justify-end"
                  imageUrl={imageUrl}
                  name={customName}
                />
              </div>
            );
          },
        }),
        columnsHelper.accessor('licensePlates', {
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
      ] as ColumnDef<CarDto>[],
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
    ...getCarsInfiniteQueryOptions({
      pageLimit: 6,
      orderBy: { column: dateColumn, ascending: true },
    }),
    enabled: !carsInfiniteIsMutating,
  });

  const tableData = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data],
  );

  const intersectionTargetRef = useInfiniteScrollTrigger<HTMLTableRowElement>({
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isSuccess,
    fetchNextPage,
  });

  useEffect(() => {
    if (!isError) return;

    addToast(
      error?.message ||
        `Cannot get cars ${label.toLowerCase()} expiration data.`,
      'error',
      queryKeySerialize(
        queryKeys.infinite({ orderBy: { column: dateColumn } }),
      ),
    );
  }, [isError, error, label, addToast, dateColumn]);

  return {
    columns,
    data: tableData,
    isLoading,
    intersectionTargetRef: intersectionTargetRef,
  };
}
