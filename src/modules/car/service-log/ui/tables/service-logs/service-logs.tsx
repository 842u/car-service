'use client';

import type { User } from '@supabase/supabase-js';
import type { ColumnDef } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import { useEffect, useMemo, useRef, useState } from 'react';

import type { Profile, ServiceLog } from '@/types';
import { serviceCategoryMapping } from '@/types';
import { filterColumnByDate } from '@/ui/table/compounds/date-filter/date-filter';
import { Table } from '@/ui/table/table';
import { UserBadge } from '@/user/ui/badge/badge';
import { createClient } from '@/utils/supabase/client';

import { TableActionsDropdown } from './actions-dropdown/actions-dropdown';

const columnsHelper = createColumnHelper<ServiceLog>();

type ServiceLogsTableProps = {
  isCurrentUserPrimaryOwner: boolean;
  serviceLogs?: ServiceLog[];
  ownersProfiles?: Profile[];
};

export function ServiceLogsTable({
  isCurrentUserPrimaryOwner,
  serviceLogs,
  ownersProfiles,
}: ServiceLogsTableProps) {
  const [user, setUser] = useState<User | null>(null);

  const tableRef = useRef<HTMLTableElement>(null);

  const columns = useMemo(
    () =>
      [
        columnsHelper.accessor('service_date', {
          meta: {
            label: 'Date',
          },
          enableSorting: true,
          enableColumnFilter: true,
          filterFn: filterColumnByDate,
        }),
        columnsHelper.accessor('created_at', {
          meta: {
            label: 'created_at',
          },
          enableSorting: true,
        }),
        columnsHelper.accessor('category', {
          meta: {
            label: 'Category',
          },
          enableColumnFilter: true,
          filterFn: 'arrIncludesSome',
        }),
        columnsHelper.accessor('mileage', {
          meta: {
            label: 'Mileage',
          },
          enableSorting: true,
        }),
        columnsHelper.accessor('service_cost', {
          meta: {
            label: 'Cost',
          },
          enableSorting: true,
        }),
        columnsHelper.accessor('notes', {
          meta: {
            label: 'Notes',
            shouldSpan: true,
          },
        }),
        columnsHelper.accessor(
          (row) => {
            const profile = ownersProfiles?.find(
              (profile) => profile.id === row.created_by,
            );

            return profile?.username;
          },
          {
            meta: {
              label: 'Creator',
            },
            id: 'created_by',
            enableSorting: true,
            sortingFn: 'alphanumeric',
            enableColumnFilter: true,
            filterFn: 'includesString',
            cell: ({ row }) => {
              const profile = ownersProfiles?.find(
                (profile) => profile.id === row.original.created_by,
              );

              return (
                profile && (
                  <UserBadge
                    className="h-10 flex-row-reverse justify-end"
                    userProfile={profile}
                  />
                )
              );
            },
          },
        ),
        columnsHelper.display({
          id: 'actions',
          cell: ({ row }) => (
            <TableActionsDropdown
              carId={row.original.car_id}
              className="w-12"
              collisionDetectionRoot={tableRef.current}
              isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
              serviceLog={row.original}
              userId={user?.id}
            />
          ),
        }),
      ] as ColumnDef<ServiceLog>[],
    [isCurrentUserPrimaryOwner, ownersProfiles, user?.id, tableRef],
  );

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };

    getUser();
  }, []);

  return (
    serviceLogs && (
      <Table
        columns={columns}
        data={serviceLogs}
        options={{
          initialState: {
            columnVisibility: {
              created_at: false,
              actions: true,
            },
            sorting: [
              { id: 'service_date', desc: true },
              { id: 'created_at', desc: true },
            ],
          },
          meta: {
            intrinsicSort: { id: 'created_at', desc: true },
          },
        }}
      >
        <Table.DateFilter columnId="service_date" />
        <Table.ValuesFilter
          checkboxLabelValueMapping={serviceCategoryMapping}
          className="my-4"
          columnId="category"
        />
        <Table.TextFilter columnId="created_by" />
        <Table.SortBreadcrumb />
        <Table.Root ref={tableRef} className="my-4 max-h-96 overflow-auto">
          <Table.Head />
          <Table.Body />
        </Table.Root>
      </Table>
    )
  );
}
