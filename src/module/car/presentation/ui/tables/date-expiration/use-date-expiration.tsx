import { useInfiniteQuery } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import { useEffect, useMemo, useRef } from 'react';

import type { CarDto } from '@/car/application/dto/car';
import { getCarsInfiniteQueryOptions } from '@/car/infrastructure/tanstack/query/options';
import { CarBadge } from '@/car/presentation/ui/badge/badge';
import { DateExpirationTableViewButton } from '@/car/presentation/ui/tables/date-expiration/view-button/view-button';
import { useToasts } from '@/common/presentation/hook/use-toasts';
import { DateExpirationStatusIcon } from '@/ui/date-expiration-status-icon/date-expiration-status-icon';

const columnsHelper = createColumnHelper<CarDto>();

interface UseDateExpirationTableParams {
  label: string;
  dateColumn: keyof Pick<
    CarDto,
    'createdAt' | 'insuranceExpiration' | 'technicalInspectionExpiration'
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
  } = useInfiniteQuery(
    getCarsInfiniteQueryOptions({
      pageLimit: 6,
      orderBy: { column: dateColumn, ascending: true },
    }),
  );

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
