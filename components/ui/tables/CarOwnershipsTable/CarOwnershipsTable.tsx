import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';

import { KeyIcon } from '@/components/decorative/icons/KeyIcon';
import { CarOwnership, Profile } from '@/types';

import { Table } from '../../shared/base/Table/Table';
import { UserBadge } from '../../UserBadge/UserBadge';
import { CarOwnershipsTableActionsDropdown } from './CarOwnershipsTableActionsDropdown';

const columnsHelper = createColumnHelper<CarOwnership>();

type CarOwnershipsTableProps = {
  carOwnerships?: CarOwnership[];
  ownersProfiles?: Profile[];
};

export function CarOwnershipsTable({
  carOwnerships,
  ownersProfiles,
}: CarOwnershipsTableProps) {
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
          cell: () => <CarOwnershipsTableActionsDropdown />,
        }),
      ] as ColumnDef<CarOwnership>[],
    [ownersProfiles],
  );

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
        <Table.Root>
          <Table.Head />
          <Table.Body />
        </Table.Root>
      </Table>
    )
  );
}
