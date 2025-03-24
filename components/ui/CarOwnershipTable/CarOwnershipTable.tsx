import { UseQueryResult } from '@tanstack/react-query';
import { UseFormRegister } from 'react-hook-form';

import { CarOwnership, Profile } from '@/types';

import { RemoveCarOwnershipFormValues } from '../RemoveCarOwnershipForm/RemoveCarOwnershipForm';
import { CarOwnershipTableHead } from './CarOwnershipTableHead';
import { CarOwnershipTableRow } from './CarOwnershipTableRow';

type CarOwnershipTableProps = {
  ownersProfilesData: UseQueryResult<Profile, Error>[];
  register?: UseFormRegister<RemoveCarOwnershipFormValues>;
  isCurrentUserPrimaryOwner: boolean;
  sessionProfileData?: Profile | null;
  carOwnershipData?: CarOwnership[];
};

export function CarOwnershipTable({
  sessionProfileData,
  ownersProfilesData,
  carOwnershipData,
  isCurrentUserPrimaryOwner,
  register,
}: CarOwnershipTableProps) {
  return (
    <div className="border-alpha-grey-300 overflow-hidden rounded-lg border">
      <table className="w-full border-collapse">
        <CarOwnershipTableHead />
        <tbody>
          <CarOwnershipTableRow
            disabled={isCurrentUserPrimaryOwner}
            ownershipData={carOwnershipData}
            profileData={sessionProfileData}
            register={register}
          />
          {ownersProfilesData.map(
            (owner) =>
              owner.data && (
                <CarOwnershipTableRow
                  key={owner.data.id}
                  disabled={!isCurrentUserPrimaryOwner}
                  ownershipData={carOwnershipData}
                  profileData={owner.data}
                  register={register}
                />
              ),
          )}
        </tbody>
      </table>
    </div>
  );
}
