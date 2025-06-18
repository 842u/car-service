'use client';

import { User } from '@supabase/supabase-js';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';

import { Profile, serviceCategoryMapping, ServiceLog } from '@/types';
import { createClient } from '@/utils/supabase/client';

import { Table } from '../../shared/base/Table/Table';
import { filterColumnByDate } from '../../shared/base/Table/TableFilterDate';
import { UserBadge } from '../../UserBadge/UserBadge';
import { CarServiceLogsTableActionsDropdown } from './CarServiceLogsTableActionsDropdown';

const columnsHelper = createColumnHelper<ServiceLog>();

type CarServiceLogsTableProps = {
  isCurrentUserPrimaryOwner: boolean;
  serviceLogs?: ServiceLog[];
  ownersProfiles?: Profile[];
};

export function CarServiceLogsTable({
  isCurrentUserPrimaryOwner,
  serviceLogs,
  ownersProfiles,
}: CarServiceLogsTableProps) {
  const [user, setUser] = useState<User | null>(null);

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
            <CarServiceLogsTableActionsDropdown
              carId={row.original.car_id}
              className="w-12"
              isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
              serviceLog={row.original}
              userId={user?.id}
            />
          ),
        }),
      ] as ColumnDef<ServiceLog>[],
    [isCurrentUserPrimaryOwner, ownersProfiles, user?.id],
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
        <Table.FilterDate columnId="service_date" />
        <Table.FilterValues
          checkboxLabelValueMapping={serviceCategoryMapping}
          className="my-4"
          columnId="category"
        />
        <Table.FilterText columnId="created_by" />
        <Table.SortBreadcrumb />
        <Table.Root className="my-4 max-h-96 overflow-auto">
          <Table.Head />
          <Table.Body />
        </Table.Root>
      </Table>
    )
  );
}
