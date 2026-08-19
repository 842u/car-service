import { createColumnHelper } from '@tanstack/react-table';
import { memo, useMemo, useRef } from 'react';

import type { ServiceLogDto } from '@/car/service-log/application/dto/service-log';
import { serviceCategoryLabelValueMapping } from '@/car/service-log/interface/ui/service-log-form.schema';
import { TableActionsDropdown } from '@/car/service-log/presentation/ui/tables/service-logs/actions-dropdown/actions-dropdown';
import { filterColumnByDate } from '@/ui/table/compounds/date-filter/filter-column-by-date';
import type { features } from '@/ui/table/features';
import { Tag } from '@/ui/tag/tag';
import { TruncatedText } from '@/ui/truncated-text/truncated-text';
import type { UserDto } from '@/user/application/dto/user';
import { UserBadge } from '@/user/presentation/ui/badge/badge';

const columnsHelper = createColumnHelper<typeof features, ServiceLogDto>();

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

const NotesCell = memo(function NotesCell({
  notes,
}: {
  notes: ServiceLogDto['notes'];
}) {
  // A wider floor than the one the spanning column gives every cell: prose
  // needs more characters per line than an identifier does before it stops
  // being readable, and this cell caps its height rather than its line count.
  return <div className="max-h-24 min-w-52 overflow-y-auto">{notes}</div>;
});

const CreatorCell = memo(function CreatorCell({
  user,
}: {
  user: UserDto | undefined;
}) {
  return user ? (
    <UserBadge className="flex-row-reverse justify-end" user={user} />
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
  serviceLog: ServiceLogDto;
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

type UseServiceLogsTableParams = {
  serviceLogs?: ServiceLogDto[];
  users?: UserDto[];
  sessionUserId?: string;
  isSessionUserPrimaryOwner?: boolean;
};

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
      columnsHelper.columns([
        columnsHelper.accessor('serviceDate', {
          meta: { label: 'Date', filter: { type: 'date' } },
          enableSorting: true,
          filterFn: filterColumnByDate,
        }),
        columnsHelper.accessor('createdAt', {
          meta: { label: 'created_at' },
          enableSorting: true,
        }),
        columnsHelper.accessor('categories', {
          meta: {
            label: 'Category',
            filter: {
              type: 'values',
              valuesMapping: serviceCategoryLabelValueMapping,
            },
          },
          enableColumnFilter: true,
          filterFn: 'arrIncludesSome',
          cell: ({ row }) => (
            <CategoryCell categories={row.original.categories} />
          ),
        }),
        columnsHelper.accessor('mileage', {
          meta: { label: 'Mileage' },
          enableSorting: true,
          cell: ({ row }) => (
            <TruncatedText className="max-w-32" text={row.original.mileage} />
          ),
        }),
        columnsHelper.accessor('serviceCost', {
          meta: { label: 'Cost' },
          enableSorting: true,
          cell: ({ row }) => (
            <TruncatedText
              className="max-w-32"
              text={row.original.serviceCost}
            />
          ),
        }),
        columnsHelper.accessor('notes', {
          meta: { label: 'Notes', shouldSpan: true },
          cell: ({ row }) => <NotesCell notes={row.original.notes} />,
        }),
        columnsHelper.accessor((row) => usersMap.get(row.authorId)?.name, {
          id: 'author',
          enableSorting: true,
          sortFn: 'alphanumeric',
          enableColumnFilter: true,
          filterFn: 'includesString',
          meta: { label: 'Creator' },
          cell: ({ row }) => (
            <CreatorCell user={usersMap.get(row.original.authorId)} />
          ),
        }),
        columnsHelper.display({
          id: 'actions',
          cell: ({ row }) => {
            const canTakeAction =
              isSessionUserPrimaryOwner ||
              row.original.authorId === sessionUserId;

            return (
              <ActionsCell
                canTakeAction={!!canTakeAction}
                carId={row.original.carId}
                collisionDetectionRoot={tableRef.current}
                serviceLog={row.original}
              />
            );
          },
        }),
      ]),
    [usersMap, sessionUserId, isSessionUserPrimaryOwner],
  );

  return {
    data: memoData,
    columns,
    tableRef,
  };
}
