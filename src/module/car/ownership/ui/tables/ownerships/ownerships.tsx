'use client';

import { useOwnershipsTable } from '@/car/ownership/ui/tables/ownerships/use-ownerships';
import type { CarOwnership } from '@/types';
import { Table } from '@/ui/table/table';
import type { UserDto } from '@/user/application/dto/user';

interface OwnershipsTableProps {
  isSessionUserPrimaryOwner: boolean;
  ownerships?: CarOwnership[];
  users?: UserDto[];
  sessionUserId?: string;
}

export function OwnershipsTable({
  isSessionUserPrimaryOwner,
  ownerships,
  users,
  sessionUserId,
}: OwnershipsTableProps) {
  const { columns, tableRef } = useOwnershipsTable({
    users,
    isSessionUserPrimaryOwner,
    sessionUserId,
  });

  return (
    <Table
      columns={columns}
      data={ownerships || []}
      options={{
        initialState: {
          columnVisibility: {
            created_at: false,
          },
          sorting: [
            { id: 'is_primary_owner', desc: true },
            { id: 'created_at', desc: true },
          ],
        },
        meta: {
          intrinsicSort: { id: 'created_at', desc: true },
        },
      }}
    >
      <Table.TextFilter className="lg:w-fit" columnId="user" />
      <Table.SortBreadcrumb className="mt-5" />
      <Table.Root
        ref={tableRef}
        className="my-4 max-h-96 overflow-auto lg:max-h-52"
      >
        <caption className="sr-only">car ownerships</caption>
        <Table.Head />
        <Table.Body />
      </Table.Root>
    </Table>
  );
}
