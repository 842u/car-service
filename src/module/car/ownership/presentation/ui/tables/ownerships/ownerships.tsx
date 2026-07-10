'use client';

import type { OwnershipDto } from '@/car/ownership/application/dto/ownership';
import { useOwnershipsTable } from '@/car/ownership/presentation/ui/tables/ownerships/use-ownerships';
import { Table } from '@/ui/table/table';
import type { UserDto } from '@/user/application/dto/user';

interface OwnershipsTableProps {
  isSessionUserPrimaryOwner: boolean;
  ownerships?: OwnershipDto[];
  users?: UserDto[];
  sessionUserId?: string;
}

export function OwnershipsTable({
  isSessionUserPrimaryOwner,
  ownerships,
  users,
  sessionUserId,
}: OwnershipsTableProps) {
  const { columns, tableRef, data } = useOwnershipsTable({
    users,
    isSessionUserPrimaryOwner,
    sessionUserId,
    ownerships,
  });

  return (
    <Table
      columns={columns}
      data={data}
      options={{
        initialState: {
          columnVisibility: {
            createdAt: false,
          },
          sorting: [
            { id: 'isPrimary', desc: true },
            { id: 'createdAt', desc: true },
          ],
        },
        meta: {
          intrinsicSort: { id: 'createdAt', desc: true },
        },
      }}
    >
      <div className="flex flex-col gap-5 md:flex-row">
        <Table.TextFilter className="lg:w-fit" columnId="user" />
        <Table.TextFilter className="lg:w-fit" columnId="ownerId" />
      </div>
      <Table.SortBreadcrumb className="mt-5" />
      <Table.Root
        ref={tableRef}
        className="my-4 max-h-96 overflow-auto lg:max-h-60"
      >
        <caption className="sr-only">car ownerships</caption>
        <Table.Head />
        <Table.Body />
      </Table.Root>
    </Table>
  );
}
