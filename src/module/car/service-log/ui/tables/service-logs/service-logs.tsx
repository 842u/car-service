'use client';

import type { ServiceLogDto } from '@/car/service-log/application/dto/service-log';
import { useServiceLogsTable } from '@/car/service-log/ui/tables/service-logs/use-service-logs';
import { Table } from '@/ui/table/table';
import type { UserDto } from '@/user/application/dto/user';

interface ServiceLogsTableProps {
  serviceLogs?: ServiceLogDto[];
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
            createdAt: false,
            actions: true,
          },
          sorting: [
            { id: 'serviceDate', desc: true },
            { id: 'createdAt', desc: true },
          ],
        },
        meta: {
          intrinsicSort: { id: 'createdAt', desc: true },
        },
      }}
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        <Table.DateFilter columnId="serviceDate" />
        <Table.TextFilter className="lg:w-fit" columnId="author" />
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
