import { DetailsTable } from '@/car/ui/tables/details/details';
import { Section } from '@/dashboard/ui/section/section';

import { Controls, ControlsProps } from './controls/controls';

export type DetailsSectionProps = ControlsProps;

export function DetailsSection({
  isCurrentUserPrimaryOwner,
  carData,
}: DetailsSectionProps) {
  return (
    <Section>
      <Section.Heading headingLevel="h2">Details</Section.Heading>
      <DetailsTable carData={carData} />
      <Controls
        carData={carData}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
      />
    </Section>
  );
}
