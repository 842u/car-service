import type { ColumnDef } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo, useRef } from 'react';

import { TableActionsDropdown } from '@/car/service-log/ui/tables/service-logs/actions-dropdown/actions-dropdown';
import { filterColumnByDate } from '@/lib/tanstack/table/filter';
import { serviceCategoryMapping, type ServiceLog } from '@/types';
import type { UserDto } from '@/user/application/dto/user';
import { UserBadge } from '@/user/presentation/ui/badge/badge';

const columnsHelper = createColumnHelper<ServiceLog>();

const getUserById = (users: UserDto[] | undefined, id: string) =>
  users?.find((user) => user.id === id);

interface UseServiceLogsTableParams {
  users?: UserDto[];
  sessionUserId?: string;
  isSessionUserPrimaryOwner?: boolean;
}
export function useServiceLogsTable({
  users,
  sessionUserId,
  isSessionUserPrimaryOwner,
}: UseServiceLogsTableParams) {
  const tableRef = useRef<HTMLTableElement>(null);

  const columns = useMemo(
    () =>
      [
        columnsHelper.accessor('service_date', {
          meta: { label: 'Date', filter: { type: 'date' } },
          enableSorting: true,
          enableColumnFilter: true,
          filterFn: filterColumnByDate,
        }),
        columnsHelper.accessor('created_at', {
          meta: { label: 'created_at' },
          enableSorting: true,
        }),
        columnsHelper.accessor('category', {
          meta: {
            label: 'Category',
            filter: { type: 'values', valuesMapping: serviceCategoryMapping },
          },
          enableColumnFilter: true,
          filterFn: 'arrIncludesSome',
        }),
        columnsHelper.accessor('mileage', {
          meta: { label: 'Mileage' },
          enableSorting: true,
        }),
        columnsHelper.accessor('service_cost', {
          meta: { label: 'Cost' },
          enableSorting: true,
        }),
        columnsHelper.accessor('notes', {
          meta: { label: 'Notes', shouldSpan: true },
        }),
        columnsHelper.accessor(
          (row) => getUserById(users, row.created_by)?.name,
          {
            meta: { label: 'Creator', filter: { type: 'text' } },
            id: 'created_by',
            enableSorting: true,
            sortingFn: 'alphanumeric',
            enableColumnFilter: true,
            filterFn: 'includesString',
            cell: ({ row }) => {
              const owner = getUserById(users, row.original.created_by);
              return (
                owner && (
                  <UserBadge
                    className="h-10 flex-row-reverse justify-end"
                    user={owner}
                  />
                )
              );
            },
          },
        ),
        columnsHelper.display({
          id: 'actions',
          cell: ({ row }) => {
            const canTakeAction =
              isSessionUserPrimaryOwner ||
              row.original.created_by === sessionUserId;

            return (
              <TableActionsDropdown
                canTakeAction={!!canTakeAction}
                carId={row.original.car_id}
                className="w-12"
                collisionDetectionRoot={tableRef.current}
                serviceLog={row.original}
              />
            );
          },
        }),
      ] as ColumnDef<ServiceLog>[],
    [users, sessionUserId, isSessionUserPrimaryOwner],
  );

  return {
    columns,
    tableRef,
  };
}
