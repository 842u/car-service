import { UseQueryResult } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { CarOwnership, Profile } from '@/types';

import { CarOwnershipControls } from '../CarOwnershipControls/CarOwnershipControls';
import { CarOwnershipTable } from '../CarOwnershipTable/CarOwnershipTable';
import { RemoveCarOwnershipFormValues } from '../RemoveCarOwnershipForm/RemoveCarOwnershipForm';

type CarOwnershipSectionProps = {
  carId: string;
  carOwnershipData: CarOwnership[] | undefined;
  ownersProfilesData: UseQueryResult<Profile, Error>[];
  sessionProfileData: Profile | undefined | null;
  isCurrentUserPrimaryOwner: boolean;
};

const defaultCarOwnershipFormValues: RemoveCarOwnershipFormValues = {
  ownersIds: [],
};

export function CarOwnershipSection({
  carId,
  carOwnershipData,
  isCurrentUserPrimaryOwner,
  ownersProfilesData,
  sessionProfileData,
}: CarOwnershipSectionProps) {
  const removeCarOwnershipFormMethods = useForm({
    mode: 'onChange',
    defaultValues: defaultCarOwnershipFormValues,
  });

  return (
    <section className="my-5 overflow-x-auto">
      <h2>Car Ownership</h2>
      <CarOwnershipTable
        carOwnershipData={carOwnershipData}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
        ownersProfilesData={ownersProfilesData}
        register={removeCarOwnershipFormMethods.register}
        sessionProfileData={sessionProfileData}
      />
      <CarOwnershipControls
        carId={carId}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
        removeCarOwnershipFormMethods={removeCarOwnershipFormMethods}
      />
    </section>
  );
}
