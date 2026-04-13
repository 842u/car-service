'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import { useEffect, useMemo, useRef, useState } from 'react';

import type { AuthIdentityPersistence } from '@/common/application/persistence-model/auth-identity';
import { browserAuthClient } from '@/dependency/auth-client/browser';
import { filterColumnByDate } from '@/lib/tanstack/table/filter';
import { serviceCategoryMapping, type ServiceLog } from '@/types';
import { Table } from '@/ui/table/table';
import type { UserDto } from '@/user/application/dto/user';
import { UserBadge } from '@/user/presentation/ui/badge/badge';

import { TableActionsDropdown } from './actions-dropdown/actions-dropdown';

const columnsHelper = createColumnHelper<ServiceLog>();

type ServiceLogsTableProps = {
  isCurrentUserPrimaryOwner: boolean;
  serviceLogs?: ServiceLog[];
  owners?: UserDto[];
};

export function ServiceLogsTable({
  isCurrentUserPrimaryOwner,
  serviceLogs,
  owners,
}: ServiceLogsTableProps) {
  const [user, setUser] = useState<AuthIdentityPersistence | null>(null);

  const tableRef = useRef<HTMLTableElement>(null);

  const columns = useMemo(
    () =>
      [
        columnsHelper.accessor('service_date', {
          meta: {
            label: 'Date',
            filter: {
              type: 'date',
            },
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
            filter: {
              type: 'values',
              valuesMapping: serviceCategoryMapping,
            },
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
            const owner = owners?.find((owner) => owner.id === row.created_by);

            return owner?.name;
          },
          {
            meta: {
              label: 'Creator',
              filter: {
                type: 'text',
              },
            },
            id: 'created_by',
            enableSorting: true,
            sortingFn: 'alphanumeric',
            enableColumnFilter: true,
            filterFn: 'includesString',
            cell: ({ row }) => {
              const owner = owners?.find(
                (owner) => owner.id === row.original.created_by,
              );

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
    [isCurrentUserPrimaryOwner, owners, user?.id, tableRef],
  );

  useEffect(() => {
    const getUser = async () => {
      const sessionResult = await browserAuthClient.authenticate();

      if (!sessionResult.success) {
        setUser(null);
        return;
      }

      const authIdentity = sessionResult.data;

      setUser(authIdentity);
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
        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <Table.DateFilter columnId="service_date" />
          <Table.TextFilter className="lg:w-fit" columnId="created_by" />
        </div>
        <Table.SortBreadcrumb className="my-5" />
        <Table.Root
          ref={tableRef}
          className="max-h-96 overflow-auto [scrollbar-gutter:stable]"
        >
          <Table.Head />
          <Table.Body />
        </Table.Root>
      </Table>
    )
  );
}
