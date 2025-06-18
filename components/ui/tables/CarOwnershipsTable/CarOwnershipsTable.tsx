import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';

import { CarOwnership, Profile } from '@/types';

import { Table } from '../../shared/base/Table/Table';
import { UserBadge } from '../../UserBadge/UserBadge';

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
        columnsHelper.accessor(
          (row) => {
            const profile = ownersProfiles?.find(
              (profile) => profile.id === row.owner_id,
            );

            return profile?.username;
          },
          {
            meta: {
              label: 'Owner',
            },
            id: 'owner',
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
        columnsHelper.accessor('owner_id', { meta: { label: 'ID' } }),
      ] as ColumnDef<CarOwnership>[],
    [ownersProfiles],
  );

  return (
    carOwnerships && (
      <Table columns={columns} data={carOwnerships}>
        <Table.Root>
          <Table.Head />
          <Table.Body />
        </Table.Root>
      </Table>
    )
  );
}
