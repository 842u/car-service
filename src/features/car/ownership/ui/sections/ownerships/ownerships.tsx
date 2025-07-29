import { Section } from '@/dashboard/ui/section/section';
import { CarOwnership, Profile } from '@/types';

import { OwnershipsTable } from '../../tables/ownerships/ownerships';
import { Controls, ControlsProps } from './controls/controls';

type OwnershipsSectionProps = ControlsProps & {
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
    <Section className="overflow-x-auto">
      <Section.Heading headingLevel="h2">Ownerships</Section.Heading>
      <OwnershipsTable
        key={ownersProfiles ? 'loaded' : 'loading'}
        carOwnerships={carOwnerships}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
        ownersProfiles={ownersProfiles}
      />
      <Controls
        carId={carId}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
      />
    </Section>
  );
}
