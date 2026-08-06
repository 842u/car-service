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
            // Definite size rather than `aspect-square h-full`: Firefox does
            // not resolve percentage heights against a table cell, so the icon
            // and the svg it sizes both collapsed to zero.
            return date ? (
              <DateExpirationStatusIcon
                className="size-10 p-0.5"
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
                  className="flex-row-reverse justify-end"
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
          // `break-all` is what makes the column elastic. An unbreakable word
          // has the same min-content and max-content size, so auto table layout
          // has no range to work with and the column can only ever be its full
          // width. A break opportunity at every character drops min-content to
          // one character while max-content stays the whole value, so the
          // column grows and shrinks with the space available. `min-w-20` puts
          // a readable floor back, and `line-clamp-1` keeps the result on one
          // line with an ellipsis instead of wrapping.
          cell: ({ row }) => (
            <div
              className="line-clamp-1 min-w-20 break-all whitespace-normal"
              title={row.original.vin ?? ''}
            >
              {row.original.vin}
            </div>
          ),
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
