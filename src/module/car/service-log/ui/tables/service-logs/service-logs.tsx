'use client';

import { useServiceLogsTable } from '@/car/service-log/ui/tables/service-logs/use-service-logs';
import { type ServiceLog } from '@/types';
import { Table } from '@/ui/table/table';
import type { UserDto } from '@/user/application/dto/user';

interface ServiceLogsTableProps {
  serviceLogs?: ServiceLog[];
  users?: UserDto[];
  isSessionUserPrimaryOwner?: boolean;
  sessionUserId?: string;
  className?: string;
}

export function ServiceLogsTable({
  serviceLogs,
  users,
  isSessionUserPrimaryOwner,
  sessionUserId,
  className = '',
}: ServiceLogsTableProps) {
  const { data, columns, tableRef } = useServiceLogsTable({
    serviceLogs,
    isSessionUserPrimaryOwner,
    sessionUserId,
    users,
  });

  return (
    <Table
      columns={columns}
      data={data}
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
      <Table.SortBreadcrumb className="mt-5" />
      <Table.Root ref={tableRef} className={className}>
        <caption className="sr-only">car service logs</caption>
        <Table.Head />
        <Table.Body />
      </Table.Root>
    </Table>
  );
}
