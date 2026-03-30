import { DashboardSection } from '@/dashboard/ui/section/section';
import type { CarOwnership } from '@/types';
import type { UserDto } from '@/user/application/dto/user';

import { OwnershipsTable } from '../../tables/ownerships/ownerships';
import type { SectionControlsProps } from './controls/controls';
import { SectionControls } from './controls/controls';

type OwnershipsSectionProps = SectionControlsProps & {
  owners?: UserDto[];
  carOwnerships?: CarOwnership[];
  className?: string;
};

export function OwnershipsSection({
  carId,
  carOwnerships,
  isCurrentUserPrimaryOwner,
  owners,
  className,
}: OwnershipsSectionProps) {
  return (
    <DashboardSection className={className}>
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
