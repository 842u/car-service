import { DashboardSection } from '../../../../features/dashboard/ui/DashboardSection/DashboardSection';
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
    <DashboardSection>
      <DashboardSection.Heading headingLevel="h2">
        Details
      </DashboardSection.Heading>
      <CarDetailsTable carData={carData} />
      <CarDetailsSectionControls
        carData={carData}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
      />
    </DashboardSection>
  );
}
