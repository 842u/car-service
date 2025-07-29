import { Section } from '@/features/dashboard/ui/section/section';
import { CarOwnership, Profile } from '@/types';

import { CarOwnershipsTable } from '../CarOwnershipsTable/CarOwnershipsTable';
import {
  CarOwnershipsSectionControls,
  CarOwnershipsSectionControlsProps,
} from './CarOwnershipsSectionControls/CarOwnershipsSectionControls';

type CarOwnershipsSectionProps = CarOwnershipsSectionControlsProps & {
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
    <Section className="overflow-x-auto">
      <Section.Heading headingLevel="h2">Ownerships</Section.Heading>
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
    </Section>
  );
}
