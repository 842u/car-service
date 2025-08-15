import { DetailsTable } from '@/car/ui/tables/details/details';
import { DashboardSection } from '@/dashboard/ui/section/section';

import type { SectionControlsProps } from './controls/controls';
import { SectionControls } from './controls/controls';

export type DetailsSectionProps = SectionControlsProps;

export function DetailsSection({
  isCurrentUserPrimaryOwner,
  carData,
}: DetailsSectionProps) {
  return (
    <DashboardSection>
      <DashboardSection.Heading headingLevel="h2">
        Details
      </DashboardSection.Heading>
      <DetailsTable carData={carData} />
      <SectionControls
        carData={carData}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
      />
    </DashboardSection>
  );
}
