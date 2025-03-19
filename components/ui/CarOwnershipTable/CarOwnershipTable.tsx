import { useQueries, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { UserMinusIcon } from '@/components/decorative/icons/UserMinusIcon';
import { UserPlusIcon } from '@/components/decorative/icons/UserPlusIcon';
import { useToasts } from '@/hooks/useToasts';
import {
  getCarOwnershipsByCarId,
  getCurrentSessionProfile,
  getProfileById,
} from '@/utils/supabase/general';

import { Button } from '../Button/Button';
import { CarOwnershipTableRow } from './CarOwnershipTableRow';

type CarOwnershipTableProps = {
  carId: string;
};

export function CarOwnershipTable({ carId }: CarOwnershipTableProps) {
  const { addToast } = useToasts();

  const { data: carOwnershipData, error: carOwnershipError } = useQuery({
    queryKey: ['ownership', carId],
    queryFn: () => getCarOwnershipsByCarId(carId),
  });

  const { data: sessionProfileData, error: sessionProfileError } = useQuery({
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

  useEffect(() => {
    carOwnershipError && addToast(carOwnershipError.message, 'error');
    sessionProfileError && addToast(sessionProfileError.message, 'error');
  }, [addToast, carOwnershipError, sessionProfileError]);

  return (
    <>
      <div className="border-alpha-grey-300 overflow-hidden rounded-lg border">
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
              ownershipData={carOwnershipData}
              profileData={sessionProfileData}
            />
            {ownersProfiles.map(
              (owner) =>
                owner.data && (
                  <CarOwnershipTableRow
                    key={owner.data.id}
                    ownershipData={carOwnershipData}
                    profileData={owner.data}
                  />
                ),
            )}
          </tbody>
        </table>
      </div>
      <div className="m-5 flex justify-end gap-5">
        <Button
          className="border-accent-500 bg-accent-800 disabled:border-accent-700 disabled:bg-accent-900 disabled:text-light-800 cursor-pointer p-1.5"
          title="Remove selected owners"
        >
          <UserMinusIcon className="stroke-light-500 mx-2 h-full w-full" />
          <span className="sr-only">Remove selected owners</span>
        </Button>
        <Button
          className="border-accent-500 bg-accent-800 disabled:border-accent-700 disabled:bg-accent-900 disabled:text-light-800 cursor-pointer p-1.5"
          title="Add owner"
        >
          <UserPlusIcon className="stroke-light-500 mx-2 h-full w-full" />
          <span className="sr-only">Add owner</span>
        </Button>
      </div>
    </>
  );
}
