import { DashboardSection } from '@/dashboard/ui/section/section';
import type { CarOwnership } from '@/types';
import type { UserDto } from '@/user/application/dto/user-dto';

import { OwnershipsTable } from '../../tables/ownerships/ownerships';
import type { SectionControlsProps } from './controls/controls';
import { SectionControls } from './controls/controls';

type OwnershipsSectionProps = SectionControlsProps & {
  owners?: UserDto[];
  carOwnerships?: CarOwnership[];
};

export function OwnershipsSection({
  carId,
  carOwnerships,
  isCurrentUserPrimaryOwner,
  owners,
}: OwnershipsSectionProps) {
  return (
    <DashboardSection className="overflow-x-auto">
      <DashboardSection.Heading headingLevel="h2">
        Ownerships
      </DashboardSection.Heading>
      <OwnershipsTable
        key={owners ? 'loaded' : 'loading'}
        carOwnerships={carOwnerships}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
        owners={owners}
      />
      <SectionControls
        carId={carId}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
      />
    </DashboardSection>
  );
}
