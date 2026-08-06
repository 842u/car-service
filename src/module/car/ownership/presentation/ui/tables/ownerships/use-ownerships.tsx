import type { ColumnDef } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import { memo, useMemo, useRef } from 'react';

import type { OwnershipDto } from '@/car/ownership/application/dto/ownership';
import { TableActionsDropdown } from '@/car/ownership/presentation/ui/tables/ownerships/actions-dropdown/actions-dropdown';
import { KeyIcon } from '@/icons/key';
import type { UserDto } from '@/user/application/dto/user';
import { UserBadge } from '@/user/presentation/ui/badge/badge';

const columnsHelper = createColumnHelper<OwnershipDto>();

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
    <UserBadge className="flex-row-reverse justify-end" user={user} />
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
  ownership: OwnershipDto;
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

type UseOwnershipsTableParams = {
  isSessionUserPrimaryOwner: boolean;
  ownerships?: OwnershipDto[];
  sessionUserId?: string;
  users?: UserDto[];
};

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
        columnsHelper.accessor('createdAt', { enableSorting: true }),
        columnsHelper.accessor('isPrimary', {
          meta: { label: 'Main Owner' },
          enableSorting: true,
          cell: ({ row }) => (
            <PrimaryOwnerCell isPrimaryOwner={row.original.isPrimary} />
          ),
        }),
        columnsHelper.accessor((row) => usersMap.get(row.ownerId)?.name, {
          meta: { label: 'User' },
          id: 'user',
          enableSorting: true,
          sortingFn: 'alphanumeric',
          enableColumnFilter: true,
          filterFn: 'includesString',
          cell: ({ row }) => (
            <UserCell user={usersMap.get(row.original.ownerId)} />
          ),
        }),
        columnsHelper.accessor('ownerId', {
          enableColumnFilter: true,
          filterFn: 'includesString',
          meta: { label: 'ID', shouldSpan: true },
          // `break-all` is what makes the column elastic. An unbreakable word
          // has the same min-content and max-content size, so auto table layout
          // has no range to work with and the column can only ever be its full
          // width. A break opportunity at every character drops min-content to
          // one character while max-content stays the whole uuid, so the column
          // grows and shrinks with the space available. `min-w-20` puts a
          // readable floor back, and `line-clamp-1` keeps the result on one
          // line with an ellipsis instead of wrapping.
          cell: ({ row }) => (
            <div
              className="line-clamp-1 min-w-20 break-all whitespace-normal"
              title={row.original.ownerId}
            >
              {row.original.ownerId}
            </div>
          ),
        }),
        columnsHelper.display({
          id: 'actions',
          cell: ({ row }) => {
            const owner = usersMap.get(row.original.ownerId);
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
      ] as ColumnDef<OwnershipDto>[],
    [usersMap, isSessionUserPrimaryOwner, sessionUserId],
  );

  return {
    data: memoData,
    columns,
    tableRef,
  };
}
