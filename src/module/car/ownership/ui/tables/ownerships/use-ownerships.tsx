import type { ColumnDef } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import { memo, useMemo, useRef } from 'react';

import { TableActionsDropdown } from '@/car/ownership/ui/tables/ownerships/actions-dropdown/actions-dropdown';
import { KeyIcon } from '@/icons/key';
import type { CarOwnership } from '@/types';
import type { UserDto } from '@/user/application/dto/user';
import { UserBadge } from '@/user/presentation/ui/badge/badge';

const columnsHelper = createColumnHelper<CarOwnership>();

const PrimaryOwnerCell = memo(function PrimaryOwnerCell({
  isPrimaryOwner,
}: {
  isPrimaryOwner: boolean;
}) {
  return isPrimaryOwner ? (
    <KeyIcon className="stroke-accent-400 m-auto h-full w-5 stroke-3 md:w-6" />
  ) : (
    <KeyIcon className="stroke-alpha-grey-300 m-auto w-5 stroke-3 md:w-6" />
  );
});

const UserCell = memo(function UserCell({
  user,
}: {
  user: UserDto | undefined;
}) {
  return user ? (
    <UserBadge className="h-10 flex-row-reverse justify-end" user={user} />
  ) : null;
});

const ActionsCell = memo(function ActionsCell({
  canDelete,
  canPromote,
  canTakeAction,
  collisionDetectionRoot,
  ownership,
  sessionUserId,
  username,
}: {
  canDelete: boolean;
  canPromote: boolean;
  canTakeAction: boolean;
  collisionDetectionRoot: HTMLElement | null;
  ownership: CarOwnership;
  sessionUserId?: string;
  username?: string;
}) {
  return (
    <TableActionsDropdown
      canDelete={canDelete}
      canPromote={canPromote}
      canTakeAction={canTakeAction}
      collisionDetectionRoot={collisionDetectionRoot}
      ownership={ownership}
      sessionUserId={sessionUserId}
      username={username}
    />
  );
});

interface UseOwnershipsTableParams {
  isSessionUserPrimaryOwner: boolean;
  ownerships?: CarOwnership[];
  sessionUserId?: string;
  users?: UserDto[];
}

export function useOwnershipsTable({
  users,
  ownerships,
  isSessionUserPrimaryOwner,
  sessionUserId,
}: UseOwnershipsTableParams) {
  const tableRef = useRef<HTMLTableElement>(null);

  const memoData = useMemo(() => ownerships || [], [ownerships]);

  const usersMap = useMemo(() => {
    if (!users) return new Map<string, UserDto>();
    return new Map(users.map((u) => [u.id, u]));
  }, [users]);

  const columns = useMemo(
    () =>
      [
        columnsHelper.accessor('created_at', { enableSorting: true }),
        columnsHelper.accessor('is_primary_owner', {
          meta: { label: 'Main Owner' },
          enableSorting: true,
          cell: ({ row }) => (
            <PrimaryOwnerCell isPrimaryOwner={row.original.is_primary_owner} />
          ),
        }),
        columnsHelper.accessor((row) => usersMap.get(row.owner_id)?.name, {
          meta: { label: 'User' },
          id: 'user',
          enableSorting: true,
          sortingFn: 'alphanumeric',
          enableColumnFilter: true,
          filterFn: 'includesString',
          cell: ({ row }) => (
            <UserCell user={usersMap.get(row.original.owner_id)} />
          ),
        }),
        columnsHelper.accessor('owner_id', {
          enableColumnFilter: true,
          filterFn: 'includesString',
          meta: { label: 'ID', shouldSpan: true },
        }),
        columnsHelper.display({
          id: 'actions',
          cell: ({ row }) => {
            const owner = usersMap.get(row.original.owner_id);
            const canPromote =
              isSessionUserPrimaryOwner && sessionUserId !== owner?.id;
            const canDelete =
              (isSessionUserPrimaryOwner && sessionUserId !== owner?.id) ||
              (!isSessionUserPrimaryOwner && sessionUserId === owner?.id);
            const canTakeAction = canPromote || canDelete;

            return (
              <ActionsCell
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
    [usersMap, isSessionUserPrimaryOwner, sessionUserId],
  );

  return {
    data: memoData,
    columns,
    tableRef,
  };
}
