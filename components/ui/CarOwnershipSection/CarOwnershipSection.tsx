import { UseQueryResult } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { CarOwnership, Profile } from '@/types';

import { CarOwnershipControls } from '../CarOwnershipControls/CarOwnershipControls';
import { CarOwnershipTable } from '../CarOwnershipTable/CarOwnershipTable';
import { DashboardSection } from '../DashboardSection/DashboardSection';
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
    <DashboardSection className="overflow-x-auto">
      <DashboardSection.Heading headingLevel="h2">
        Ownership
      </DashboardSection.Heading>
      <CarOwnershipTable
        carOwnershipData={carOwnershipData}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
        ownersProfilesData={ownersProfilesData}
        register={removeCarOwnershipFormMethods.register}
        sessionProfileData={sessionProfileData}
      />
      <DashboardSection.Controls className="mt-4">
        <CarOwnershipControls
          carId={carId}
          isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
          removeCarOwnershipFormMethods={removeCarOwnershipFormMethods}
        />
      </DashboardSection.Controls>
    </DashboardSection>
  );
}
