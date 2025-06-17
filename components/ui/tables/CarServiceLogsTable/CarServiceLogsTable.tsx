'use client';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';

import { serviceCategoryMapping, ServiceLog } from '@/types';

import { Table } from '../../shared/base/Table/Table';
import { filterColumnByDate } from '../../shared/base/Table/TableFilterDate';
import { CarServiceLogsTableActionsDropdown } from './CarServiceLogsTableActionsDropdown';

const columnsHelper = createColumnHelper<ServiceLog>();

type CarServiceLogsTableProps = {
  isCurrentUserPrimaryOwner: boolean;
  serviceLogs?: ServiceLog[];
};

export function CarServiceLogsTable({
  isCurrentUserPrimaryOwner,
  serviceLogs,
}: CarServiceLogsTableProps) {
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
        columnsHelper.display({
          id: 'actions',
          cell: ({ row }) => (
            <CarServiceLogsTableActionsDropdown
              carId={row.original.car_id}
              className="w-12"
              isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
              serviceLog={row.original}
            />
          ),
        }),
      ] as ColumnDef<ServiceLog>[],
    [isCurrentUserPrimaryOwner],
  );

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
        <Table.SortBreadcrumb />
        <Table.Root className="my-4 max-h-96 overflow-auto">
          <Table.Head />
          <Table.Body />
        </Table.Root>
      </Table>
    )
  );
}
