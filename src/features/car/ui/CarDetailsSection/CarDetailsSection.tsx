import { Section } from '../../../dashboard/ui/section/section';
import { CarDetailsTable } from '../CarDetailsTable/CarDetailsTable';
import {
  CarDetailsSectionControls,
  CarDetailsSectionControlsProps,
} from './CarDetailsSectionControls/CarDetailsSectionControls';

export type CarDetailsSectionProps = CarDetailsSectionControlsProps;

export function CarDetailsSection({
  isCurrentUserPrimaryOwner,
  carData,
}: CarDetailsSectionProps) {
  return (
    <Section>
      <Section.Heading headingLevel="h2">Details</Section.Heading>
      <CarDetailsTable carData={carData} />
      <CarDetailsSectionControls
        carData={carData}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
      />
    </Section>
  );
}
