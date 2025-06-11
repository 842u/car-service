'use client';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

import { ServiceLog } from '@/types';

import { Table } from '../../shared/base/Table/Table';

type CarServiceLogsTableProps = {
  serviceLogs?: ServiceLog[];
};

const columnsHelper = createColumnHelper<ServiceLog>();

const columns = [
  columnsHelper.accessor('service_date', {
    meta: {
      label: 'Date',
    },
    enableSorting: true,
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
    },
  }),
  columnsHelper.display({ id: 'actions', cell: () => 'action' }),
] as ColumnDef<ServiceLog>[];

export function CarServiceLogsTable({ serviceLogs }: CarServiceLogsTableProps) {
  return (
    serviceLogs && (
      <Table
        columns={columns}
        data={serviceLogs}
        options={{
          initialState: {
            columnVisibility: {
              created_at: false,
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
        <Table.Head />
        <Table.Body />
      </Table>
    )
  );
}
