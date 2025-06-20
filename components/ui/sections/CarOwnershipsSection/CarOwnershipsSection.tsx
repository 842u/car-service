import { CarOwnership, Profile } from '@/types';

import { DashboardSection } from '../../shared/DashboardSection/DashboardSection';
import { CarOwnershipsTable } from '../../tables/CarOwnershipsTable/CarOwnershipsTable';
import { CarOwnershipsSectionControls } from './CarOwnershipsSectionControls';

type CarOwnershipsSectionProps = {
  carId: string;
  isCurrentUserPrimaryOwner: boolean;
  ownersProfiles?: Profile[];
  carOwnerships?: CarOwnership[];
};

export function CarOwnershipsSection({
  carId,
  carOwnerships,
  isCurrentUserPrimaryOwner,
  ownersProfiles,
}: CarOwnershipsSectionProps) {
  return (
    <DashboardSection className="overflow-x-auto">
      <DashboardSection.Heading headingLevel="h2">
        Ownerships
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
      />
    </DashboardSection>
  );
}
