import { DashboardSection } from '@/dashboard/ui/section/section';
import type { CarOwnership, Profile } from '@/types';

import { OwnershipsTable } from '../../tables/ownerships/ownerships';
import type { SectionControlsProps } from './controls/controls';
import { SectionControls } from './controls/controls';

type OwnershipsSectionProps = SectionControlsProps & {
  ownersProfiles?: Profile[];
  carOwnerships?: CarOwnership[];
};

export function OwnershipsSection({
  carId,
  carOwnerships,
  isCurrentUserPrimaryOwner,
  ownersProfiles,
}: OwnershipsSectionProps) {
  return (
    <DashboardSection className="overflow-x-auto">
      <DashboardSection.Heading headingLevel="h2">
        Ownerships
      </DashboardSection.Heading>
      <OwnershipsTable
        key={ownersProfiles ? 'loaded' : 'loading'}
        carOwnerships={carOwnerships}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
        ownersProfiles={ownersProfiles}
      />
      <SectionControls
        carId={carId}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
      />
    </DashboardSection>
  );
}
