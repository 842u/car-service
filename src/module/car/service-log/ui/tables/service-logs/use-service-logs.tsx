import type { ColumnDef } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import { memo, useMemo, useRef } from 'react';

import { TableActionsDropdown } from '@/car/service-log/ui/tables/service-logs/actions-dropdown/actions-dropdown';
import { filterColumnByDate } from '@/lib/tanstack/table/filter';
import { serviceCategoryMapping, type ServiceLog } from '@/types';
import { Tag } from '@/ui/tag/tag';
import type { UserDto } from '@/user/application/dto/user';
import { UserBadge } from '@/user/presentation/ui/badge/badge';

const columnsHelper = createColumnHelper<ServiceLog>();

const CategoryCell = memo(function CategoryCell({
  categories,
}: {
  categories: string[];
}) {
  return (
    <div className="flex w-44 max-w-52 flex-wrap gap-1">
      {categories.map((category) => (
        <Tag key={category}>{category}</Tag>
      ))}
    </div>
  );
});

const MileageCell = memo(function MileageCell({
  mileage,
}: {
  mileage: ServiceLog['mileage'];
}) {
  return <div className="max-w-32 overflow-x-auto">{mileage}</div>;
});

const CostCell = memo(function CostCell({
  cost,
}: {
  cost: ServiceLog['service_cost'];
}) {
  return <div className="max-w-32 overflow-x-auto">{cost}</div>;
});

const NotesCell = memo(function NotesCell({
  notes,
}: {
  notes: ServiceLog['notes'];
}) {
  return (
    <div className="max-h-24 w-52 overflow-y-auto text-wrap lg:w-fit">
      {notes}
    </div>
  );
});

const CreatorCell = memo(function CreatorCell({
  user,
}: {
  user: UserDto | undefined;
}) {
  return user ? (
    <UserBadge className="h-10 flex-row-reverse justify-end" user={user} />
  ) : null;
});

const ActionsCell = memo(function ActionsCell({
  canTakeAction,
  carId,
  serviceLog,
  collisionDetectionRoot,
}: {
  canTakeAction: boolean;
  carId: string;
  serviceLog: ServiceLog;
  collisionDetectionRoot: HTMLElement | null;
}) {
  return (
    <TableActionsDropdown
      canTakeAction={canTakeAction}
      carId={carId}
      className="w-12"
      collisionDetectionRoot={collisionDetectionRoot}
      serviceLog={serviceLog}
    />
  );
});

interface UseServiceLogsTableParams {
  serviceLogs?: ServiceLog[];
  users?: UserDto[];
  sessionUserId?: string;
  isSessionUserPrimaryOwner?: boolean;
}

export function useServiceLogsTable({
  serviceLogs,
  users,
  sessionUserId,
  isSessionUserPrimaryOwner,
}: UseServiceLogsTableParams) {
  const tableRef = useRef<HTMLTableElement>(null);

  const memoData = useMemo(() => serviceLogs || [], [serviceLogs]);

  const usersMap = useMemo(() => {
    if (!users) return new Map<string, UserDto>();
    return new Map(users.map((u) => [u.id, u]));
  }, [users]);

  const columns = useMemo(
    () =>
      [
        columnsHelper.accessor('service_date', {
          meta: { label: 'Date', filter: { type: 'date' } },
          enableSorting: true,
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
          cell: ({ row }) => (
            <CategoryCell categories={row.original.category} />
          ),
        }),
        columnsHelper.accessor('mileage', {
          meta: { label: 'Mileage' },
          enableSorting: true,
          cell: ({ row }) => <MileageCell mileage={row.original.mileage} />,
        }),
        columnsHelper.accessor('service_cost', {
          meta: { label: 'Cost' },
          enableSorting: true,
          cell: ({ row }) => <CostCell cost={row.original.service_cost} />,
        }),
        columnsHelper.accessor('notes', {
          meta: { label: 'Notes', shouldSpan: true },
          cell: ({ row }) => <NotesCell notes={row.original.notes} />,
        }),
        columnsHelper.accessor((row) => usersMap.get(row.created_by)?.name, {
          id: 'created_by',
          enableSorting: true,
          sortingFn: 'alphanumeric',
          enableColumnFilter: true,
          filterFn: 'includesString',
          meta: { label: 'Creator' },
          cell: ({ row }) => (
            <CreatorCell user={usersMap.get(row.original.created_by)} />
          ),
        }),
        columnsHelper.display({
          id: 'actions',
          cell: ({ row }) => {
            const canTakeAction =
              isSessionUserPrimaryOwner ||
              row.original.created_by === sessionUserId;

            return (
              <ActionsCell
                canTakeAction={!!canTakeAction}
                carId={row.original.car_id}
                collisionDetectionRoot={tableRef.current}
                serviceLog={row.original}
              />
            );
          },
        }),
      ] as ColumnDef<ServiceLog>[],
    [usersMap, sessionUserId, isSessionUserPrimaryOwner],
  );

  return {
    data: memoData,
    columns,
    tableRef,
  };
}
