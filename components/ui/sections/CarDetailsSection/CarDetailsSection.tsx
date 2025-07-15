import { useRef } from 'react';

import { Car } from '@/types';

import { CarEditButton } from '../../buttons/CarEditButton/CarEditButton';
import { CarEditModal } from '../../modals/CarEditModal/CarEditModal';
import { DialogModalRef } from '../../shared/base/DialogModal/DialogModal';
import { DashboardSection } from '../../shared/DashboardSection/DashboardSection';
import { CarDetailsTable } from '../../tables/CarDetailsTable/CarDetailsTable';

export type CarDetailsSectionProps = {
  isCurrentUserPrimaryOwner: boolean;
  carData?: Car;
};

export function CarDetailsSection({
  isCurrentUserPrimaryOwner,
  carData,
}: CarDetailsSectionProps) {
  const dialogRef = useRef<DialogModalRef>(null);

  const handleCarEditButtonClick = () => dialogRef.current?.showModal();

  const handleCarEditModalSubmit = () => dialogRef.current?.closeModal();

  return (
    <DashboardSection>
      <DashboardSection.Heading headingLevel="h2">
        Details
      </DashboardSection.Heading>
      <CarDetailsTable carData={carData} />
      <DashboardSection.Controls>
        <CarEditButton
          disabled={!isCurrentUserPrimaryOwner}
          onClick={handleCarEditButtonClick}
        />
        <CarEditModal
          ref={dialogRef}
          carData={carData}
          onSubmit={handleCarEditModalSubmit}
        />
      </DashboardSection.Controls>
    </DashboardSection>
  );
}
