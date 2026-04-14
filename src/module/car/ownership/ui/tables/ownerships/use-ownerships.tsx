import type { ColumnDef } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo, useRef } from 'react';

import { TableActionsDropdown } from '@/car/ownership/ui/tables/ownerships/actions-dropdown/actions-dropdown';
import { KeyIcon } from '@/icons/key';
import type { CarOwnership } from '@/types';
import type { UserDto } from '@/user/application/dto/user';
import { UserBadge } from '@/user/presentation/ui/badge/badge';

const columnsHelper = createColumnHelper<CarOwnership>();

interface UseOwnershipsTableParams {
  isSessionUserPrimaryOwner: boolean;
  sessionUserId?: string;
  users?: UserDto[];
}

export function useOwnershipsTable({
  users,
  isSessionUserPrimaryOwner,
  sessionUserId,
}: UseOwnershipsTableParams) {
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
            const owner = users?.find((user) => user.id === row.owner_id);

            return owner?.name;
          },
          {
            meta: {
              label: 'User',
              shouldSpan: true,
            },
            id: 'user',
            cell: ({ row }) => {
              const owner = users?.find(
                (user) => user.id === row.original.owner_id,
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
            const owner = users?.find(
              (user) => user.id === row.original.owner_id,
            );
            const canPromote =
              isSessionUserPrimaryOwner && sessionUserId !== owner?.id;
            const canDelete =
              (isSessionUserPrimaryOwner && sessionUserId !== owner?.id) ||
              (!isSessionUserPrimaryOwner && sessionUserId === owner?.id);
            const canTakeAction = canPromote || canDelete;

            return (
              <TableActionsDropdown
                canDelete={canDelete}
                canPromote={canPromote}
                canTakeAction={canTakeAction}
                collisionDetectionRoot={tableRef.current}
                ownership={row.original}
                sessionUserId={sessionUserId}
                username={owner?.name}
              />
            );
          },
        }),
      ] as ColumnDef<CarOwnership>[],
    [users, isSessionUserPrimaryOwner, sessionUserId],
  );

  return {
    columns,
    tableRef,
  };
}
