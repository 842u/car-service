import { useForm } from 'react-hook-form';

import { CarOwnership, Profile } from '@/types';

import { CarOwnershipDeleteFormValues } from '../../forms/CarOwnershipDeleteForm/CarOwnershipDeleteForm';
import { DashboardSection } from '../../shared/DashboardSection/DashboardSection';
import { CarOwnershipsTable } from '../../tables/CarOwnershipsTable/CarOwnershipsTable';
import { CarOwnershipsSectionControls } from './CarOwnershipsSectionControls';

type CarOwnershipsSectionProps = {
  carId: string;
  isCurrentUserPrimaryOwner: boolean;
  ownersProfiles?: Profile[];
  carOwnerships?: CarOwnership[];
};

export const defaultCarOwnershipsFormValues: CarOwnershipDeleteFormValues = {
  ownersIds: [],
};

export function CarOwnershipsSection({
  carId,
  carOwnerships,
  isCurrentUserPrimaryOwner,
  ownersProfiles,
}: CarOwnershipsSectionProps) {
  const removeCarOwnershipFormMethods = useForm({
    mode: 'onChange',
    defaultValues: defaultCarOwnershipsFormValues,
  });

  return (
    <DashboardSection className="overflow-x-auto">
      <DashboardSection.Heading headingLevel="h2">
        Ownership
      </DashboardSection.Heading>
      <CarOwnershipsTable
        key={ownersProfiles ? 'loaded' : 'loading'}
        carOwnerships={carOwnerships}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
        ownersProfiles={ownersProfiles}
      />
      <CarOwnershipsSectionControls
        carId={carId}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
        removeCarOwnershipFormMethods={removeCarOwnershipFormMethods}
      />
    </DashboardSection>
  );
}
