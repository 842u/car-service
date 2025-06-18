import { useForm } from 'react-hook-form';

import { CarOwnership, Profile } from '@/types';

import { CarOwnershipDeleteFormValues } from '../../forms/CarOwnershipDeleteForm/CarOwnershipDeleteForm';
import { DashboardSection } from '../../shared/DashboardSection/DashboardSection';
import { CarOwnershipsTable } from '../../tables/CarOwnershipsTable/CarOwnershipsTable';
import { CarOwnershipSectionControls } from './CarOwnershipSectionControls';

type CarOwnershipSectionProps = {
  carId: string;
  isCurrentUserPrimaryOwner: boolean;
  ownersProfiles?: Profile[];
  carOwnerships?: CarOwnership[];
};

export const defaultCarOwnershipFormValues: CarOwnershipDeleteFormValues = {
  ownersIds: [],
};

export function CarOwnershipSection({
  carId,
  carOwnerships,
  isCurrentUserPrimaryOwner,
  ownersProfiles,
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
      <CarOwnershipsTable
        key={ownersProfiles ? 'loaded' : 'loading'}
        carOwnerships={carOwnerships}
        ownersProfiles={ownersProfiles}
      />
      <CarOwnershipSectionControls
        carId={carId}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
        removeCarOwnershipFormMethods={removeCarOwnershipFormMethods}
      />
    </DashboardSection>
  );
}
