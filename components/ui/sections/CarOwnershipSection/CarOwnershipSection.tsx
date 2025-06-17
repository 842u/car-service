import { useForm } from 'react-hook-form';

import { CarOwnership, Profile } from '@/types';

import { CarOwnershipDeleteFormValues } from '../../forms/CarOwnershipDeleteForm/CarOwnershipDeleteForm';
import { DashboardSection } from '../../shared/DashboardSection/DashboardSection';
import { CarOwnershipTable } from '../../tables/CarOwnershipTable/CarOwnershipTable';
import { CarOwnershipSectionControls } from './CarOwnershipSectionControls';

type CarOwnershipSectionProps = {
  carId: string;
  isCurrentUserPrimaryOwner: boolean;
  ownersProfilesData?: (Profile | undefined)[];
  carOwnershipData?: CarOwnership[];
};

export const defaultCarOwnershipFormValues: CarOwnershipDeleteFormValues = {
  ownersIds: [],
};

export function CarOwnershipSection({
  carId,
  carOwnershipData,
  isCurrentUserPrimaryOwner,
  ownersProfilesData,
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
      />
      <CarOwnershipSectionControls
        carId={carId}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
        removeCarOwnershipFormMethods={removeCarOwnershipFormMethods}
      />
    </DashboardSection>
  );
}
