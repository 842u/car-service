import { Car } from '@/types';

import { DashboardSection } from '../../shared/DashboardSection/DashboardSection';
import { CarDetailsTable } from '../../tables/CarDetailsTable/CarDetailsTable';
import { CarDetailsSectionControls } from './CarDetailsSectionControls/CarDetailsSectionControls';

export type CarDetailsSectionProps = {
  isCurrentUserPrimaryOwner: boolean;
  carData?: Car;
};

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
