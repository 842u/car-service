import { useQueries, useQuery } from '@tanstack/react-query';

import {
  getCarOwnershipsByCarId,
  getCurrentSessionProfile,
  getProfileById,
} from '@/utils/supabase/general';

import { CarOwnershipTableRow } from './CarOwnershipTableRow';

type CarOwnershipTableProps = {
  carId: string;
};

export function CarOwnershipTable({ carId }: CarOwnershipTableProps) {
  const { data: carOwnershipData } = useQuery({
    queryKey: ['ownership', carId],
    queryFn: () => getCarOwnershipsByCarId(carId),
  });

  const { data: sessionProfileData } = useQuery({
    queryKey: ['profile', 'session'],
    queryFn: getCurrentSessionProfile,
  });

  const allowDependentQueries =
    sessionProfileData && carOwnershipData && carOwnershipData.length;

  const ownersProfiles = useQueries({
    queries: allowDependentQueries
      ? carOwnershipData
          .filter((ownership) => ownership.owner_id !== sessionProfileData.id)
          .map((ownership) => {
            return {
              queryKey: ['profile', ownership.owner_id],
              queryFn: () => getProfileById(ownership.owner_id),
            };
          })
      : [],
  });

  return (
    <table className="w-full border-collapse">
      <thead className="bg-alpha-grey-100 border-alpha-grey-200">
        <tr className="md:whitespace-nowrap">
          <th className="border-alpha-grey-200 border p-2">
            <span className="sr-only">Select</span>
          </th>
          <th className="border-alpha-grey-200 hidden border p-2 md:table-cell">
            <span className="sr-only">Owner Avatar</span>
          </th>
          <th className="border-alpha-grey-200 border p-2 md:table-cell">
            Username
          </th>
          <th className="border-alpha-grey-200 border p-2">Owner ID</th>
          <th className="border-alpha-grey-200 border p-2">Main Owner</th>
        </tr>
      </thead>

      <tbody>
        <CarOwnershipTableRow
          ownershipsData={carOwnershipData}
          sessionProfileData={sessionProfileData}
        />
        {ownersProfiles.map(
          (owner) =>
            owner.data && (
              <CarOwnershipTableRow
                key={owner.data.id}
                ownershipsData={carOwnershipData}
                sessionProfileData={owner.data}
              />
            ),
        )}
      </tbody>
    </table>
  );
}
