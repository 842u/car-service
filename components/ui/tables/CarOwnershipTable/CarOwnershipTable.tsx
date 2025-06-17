import { UseFormRegister } from 'react-hook-form';

import { CarOwnership, Profile } from '@/types';

import { CarOwnershipDeleteFormValues } from '../../forms/CarOwnershipDeleteForm/CarOwnershipDeleteForm';
import { CarOwnershipTableHead } from './CarOwnershipTableHead';
import { CarOwnershipTableRow } from './CarOwnershipTableRow';

type CarOwnershipTableProps = {
  isCurrentUserPrimaryOwner: boolean;
  ownersProfilesData?: (Profile | undefined)[];
  register?: UseFormRegister<CarOwnershipDeleteFormValues>;
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
      <table
        aria-label="car ownership table"
        className="w-full border-collapse"
      >
        <CarOwnershipTableHead />
        <tbody>
          <CarOwnershipTableRow
            disabled={isCurrentUserPrimaryOwner}
            ownershipData={carOwnershipData}
            profileData={sessionProfileData}
            register={register}
          />
          {ownersProfilesData?.map(
            (owner) =>
              owner && (
                <CarOwnershipTableRow
                  key={owner.id}
                  disabled={!isCurrentUserPrimaryOwner}
                  ownershipData={carOwnershipData}
                  profileData={owner}
                  register={register}
                />
              ),
          )}
        </tbody>
      </table>
    </div>
  );
}
