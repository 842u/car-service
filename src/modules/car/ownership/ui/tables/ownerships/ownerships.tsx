'use client';

import type { User as AuthIdentity } from '@supabase/supabase-js';
import type { ColumnDef } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import { useEffect, useMemo, useRef, useState } from 'react';

import { dependencyContainer, dependencyTokens } from '@/di';
import { KeyIcon } from '@/icons/key';
import type { CarOwnership } from '@/types';
import { Table } from '@/ui/table/table';
import type { UserDto } from '@/user/application/dtos/user-dto';
import { UserBadge } from '@/user/presentation/ui/badge/badge';

import { TableActionsDropdown } from './actions-dropdown/actions-dropdown';

const columnsHelper = createColumnHelper<CarOwnership>();

type OwnershipsTableProps = {
  isCurrentUserPrimaryOwner: boolean;
  carOwnerships?: CarOwnership[];
  owners?: UserDto[];
};

export function OwnershipsTable({
  isCurrentUserPrimaryOwner,
  carOwnerships,
  owners,
}: OwnershipsTableProps) {
  const [user, setUser] = useState<AuthIdentity | null>(null);

  const tableRef = useRef<HTMLTableElement>(null);

  const columns = useMemo(
    () =>
      [
        columnsHelper.accessor('created_at', { enableSorting: true }),
        columnsHelper.accessor('is_primary_owner', {
          meta: {
            label: 'Main Owner',
          },
          cell: ({ row }) => {
            const isPrimaryOwner = row.original.is_primary_owner;

            return isPrimaryOwner ? (
              <KeyIcon className="stroke-accent-400 m-auto h-full w-5 stroke-3 md:w-6" />
            ) : (
              <KeyIcon className="stroke-alpha-grey-300 m-auto w-5 stroke-3 md:w-6" />
            );
          },
          enableSorting: true,
        }),
        columnsHelper.accessor(
          (row) => {
            const owner = owners?.find((owner) => owner.id === row.owner_id);

            return owner?.name;
          },
          {
            meta: {
              label: 'User',
              shouldSpan: true,
            },
            id: 'user',
            cell: ({ row }) => {
              const owner = owners?.find(
                (owner) => owner.id === row.original.owner_id,
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
            enableSorting: true,
            sortingFn: 'alphanumeric',
            enableColumnFilter: true,
            filterFn: 'includesString',
          },
        ),
        columnsHelper.accessor('owner_id', {
          meta: {
            label: 'ID',
            shouldSpan: true,
          },
        }),
        columnsHelper.display({
          id: 'actions',
          cell: ({ row }) => {
            const owner = owners?.find(
              (owner) => owner.id === row.original.owner_id,
            );

            return (
              <TableActionsDropdown
                collisionDetectionRoot={tableRef.current}
                isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
                ownership={row.original}
                ownerUsername={owner?.name}
                userId={user?.id}
              />
            );
          },
        }),
      ] as ColumnDef<CarOwnership>[],
    [owners, isCurrentUserPrimaryOwner, user?.id],
  );

  useEffect(() => {
    const getUser = async () => {
      const authClient = await dependencyContainer.resolve(
        dependencyTokens.AUTH_CLIENT_BROWSER,
      );

      const sessionResult = await authClient.getSession();

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
    carOwnerships && (
      <Table
        columns={columns}
        data={carOwnerships}
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
        <Table.TextFilter columnId="user" />
        <Table.SortBreadcrumb />
        <Table.Root ref={tableRef} className="my-4 overflow-auto">
          <caption className="sr-only">car ownerships</caption>
          <Table.Head />
          <Table.Body />
        </Table.Root>
      </Table>
    )
  );
}
