'use client';

import { useQuery } from '@tanstack/react-query';

import { CarOwnership, Profile } from '@/types';
import {
  getCarById,
  getCarOwnershipsByCarId,
  getCurrentSessionProfile,
} from '@/utils/supabase/general';

import { AvatarImage } from '../AvatarImage/AvatarImage';
import { CarBadge } from '../CarBadge/CarBadge';

type CarOverviewProps = {
  carId: string;
};

export function CarOverview({ carId }: CarOverviewProps) {
  const { data: carData, isPending } = useQuery({
    queryKey: ['car', carId],
    queryFn: () => getCarById(carId),
  });

  const { data: ownershipsData } = useQuery({
    queryKey: ['ownership', carId],
    queryFn: () => getCarOwnershipsByCarId(carId),
  });

  const { data: sessionProfileData } = useQuery({
    queryKey: ['profile', 'session'],
    queryFn: getCurrentSessionProfile,
  });

  return (
    <section className="w-full self-start p-5">
      <CarBadge
        imageUrl={carData?.image_url}
        isPending={isPending}
        name={carData?.custom_name}
      />
      <section className="my-5 overflow-x-auto">
        <h2>Car Ownership</h2>
        <div className="border-alpha-grey-300 overflow-hidden rounded-lg border">
          <table className="w-full border-collapse">
            <thead className="bg-alpha-grey-100 border-alpha-grey-200">
              <tr className="whitespace-nowrap">
                <th className="border-alpha-grey-200 border p-2">
                  <span className="sr-only">Select</span>
                </th>
                <th className="border-alpha-grey-200 hidden border p-2 md:table-cell">
                  <span className="sr-only">Owner Avatar</span>
                </th>
                <th className="border-alpha-grey-200 hidden border p-2 md:table-cell">
                  Username
                </th>
                <th className="border-alpha-grey-200 border p-2">Owner ID</th>
                <th className="border-alpha-grey-200 border p-2">Main Owner</th>
              </tr>
            </thead>

            <tbody>
              <TableRow
                ownershipsData={ownershipsData}
                profileData={sessionProfileData}
              />
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

type TableRowProps = {
  profileData?: Profile | null;
  ownershipsData?: CarOwnership[];
};

function TableRow({ profileData, ownershipsData }: TableRowProps) {
  return (
    <tr className="whitespace-nowrap">
      <td className="border-alpha-grey-200 border p-2 text-center align-middle">
        <input type="checkbox" />
      </td>
      <td className="border-alpha-grey-200 hidden border p-2 text-center align-middle md:table-cell md:w-10">
        <AvatarImage
          className="aspect-square overflow-hidden rounded-full"
          src={profileData?.avatar_url}
        />
      </td>
      <td className="border-alpha-grey-200 hidden border p-2 text-center align-middle md:table-cell">
        {profileData?.username}
      </td>
      <td className="border-alpha-grey-200 max-w-[150px] overflow-auto border p-2">
        {profileData?.id}
      </td>
      <td className="border-alpha-grey-200 border p-2 text-center align-middle">
        {ownershipsData?.find(
          (ownership) =>
            ownership.owner_id === profileData?.id &&
            ownership.is_primary_owner,
        ) ? (
          <input checked readOnly type="checkbox" />
        ) : (
          <input readOnly checked={false} type="checkbox" />
        )}
      </td>
    </tr>
  );
}
