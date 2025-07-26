'use client';

import { User } from '@supabase/supabase-js';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useEffect, useMemo, useRef, useState } from 'react';

import { KeyIcon } from '@/features/common/ui/decorative/icons/KeyIcon';
import { CarOwnership, Profile } from '@/types';
import { createClient } from '@/utils/supabase/client';

import { Table } from '../../shared/base/Table/Table';
import { UserBadge } from '../../UserBadge/UserBadge';
import { CarOwnershipsTableActionsDropdown } from './CarOwnershipsTableActionsDropdown/CarOwnershipsTableActionsDropdown';

const columnsHelper = createColumnHelper<CarOwnership>();

type CarOwnershipsTableProps = {
  isCurrentUserPrimaryOwner: boolean;
  carOwnerships?: CarOwnership[];
  ownersProfiles?: Profile[];
};

export function CarOwnershipsTable({
  isCurrentUserPrimaryOwner,
  carOwnerships,
  ownersProfiles,
}: CarOwnershipsTableProps) {
  const [user, setUser] = useState<User | null>(null);

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
            const profile = ownersProfiles?.find(
              (profile) => profile.id === row.owner_id,
            );

            return profile?.username;
          },
          {
            meta: {
              label: 'User',
              shouldSpan: true,
            },
            id: 'user',
            cell: ({ row }) => {
              const profile = ownersProfiles?.find(
                (profile) => profile.id === row.original.owner_id,
              );

              return (
                profile && (
                  <UserBadge
                    className="h-10 flex-row-reverse justify-end"
                    userProfile={profile}
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
            const profile = ownersProfiles?.find(
              (profile) => profile.id === row.original.owner_id,
            );

            return (
              <CarOwnershipsTableActionsDropdown
                collisionDetectionRoot={tableRef.current}
                isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
                ownership={row.original}
                ownerUsername={profile?.username}
                userId={user?.id}
              />
            );
          },
        }),
      ] as ColumnDef<CarOwnership>[],
    [ownersProfiles, isCurrentUserPrimaryOwner, user?.id],
  );

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
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
        <Table.FilterText columnId="user" />
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
