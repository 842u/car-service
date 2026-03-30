import { DetailsCard } from '@/car/ui/cards/details/details';
import { DashboardSection } from '@/dashboard/ui/section/section';

import type { SectionControlsProps } from './controls/controls';
import { SectionControls } from './controls/controls';

export type DetailsSectionProps = { className?: string } & SectionControlsProps;

export function DetailsSection({
  isCurrentUserPrimaryOwner,
  carData,
  className,
}: DetailsSectionProps) {
  return (
    <DashboardSection aria-label="Vehicle details" className={className}>
      <DetailsCard className="mb-5" data={carData} />
      <SectionControls
        carData={carData}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
      />
    </DashboardSection>
  );
}
