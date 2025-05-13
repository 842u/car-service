import { UseQueryResult } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { CarOwnership, Profile } from '@/types';

import { CarOwnershipDeleteFormValues } from '../../forms/CarOwnershipDeleteForm/CarOwnershipDeleteForm';
import { DashboardSection } from '../../shared/DashboardSection/DashboardSection';
import { CarOwnershipTable } from '../../tables/CarOwnershipTable/CarOwnershipTable';
import { CarOwnershipSectionControls } from './CarOwnershipSectionControls';

type CarOwnershipSectionProps = {
  carId: string;
  carOwnershipData: CarOwnership[] | undefined;
  ownersProfilesData: UseQueryResult<Profile, Error>[];
  sessionProfileData: Profile | undefined | null;
  isCurrentUserPrimaryOwner: boolean;
};

export const defaultCarOwnershipFormValues: CarOwnershipDeleteFormValues = {
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
      <CarOwnershipSectionControls
        carId={carId}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
        removeCarOwnershipFormMethods={removeCarOwnershipFormMethods}
      />
    </DashboardSection>
  );
}
