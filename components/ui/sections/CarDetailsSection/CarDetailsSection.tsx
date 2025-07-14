import { useRef } from 'react';

import { Car } from '@/types';

import { CarEditButton } from '../../buttons/CarEditButton/CarEditButton';
import { CarEditForm } from '../../forms/CarEditForm/CarEditForm';
import {
  DialogModal,
  DialogModalRef,
} from '../../shared/base/DialogModal/DialogModal';
import { DashboardSection } from '../../shared/DashboardSection/DashboardSection';
import { CarDetailsTable } from '../../tables/CarDetailsTable/CarDetailsTable';

export type CarDetailsSectionProps = {
  carId: string;
  isCurrentUserPrimaryOwner: boolean;
  carData?: Car;
};

export function CarDetailsSection({
  carId,
  carData,
  isCurrentUserPrimaryOwner,
}: CarDetailsSectionProps) {
  const dialogModalRef = useRef<DialogModalRef>(null);

  const handleEditCarButtonClick = () => dialogModalRef.current?.showModal();

  const handleCarEditFormSubmit = () => dialogModalRef.current?.closeModal();

  return (
    <DashboardSection>
      <DashboardSection.Heading headingLevel="h2">
        Details
      </DashboardSection.Heading>
      <CarDetailsTable carData={carData} />
      <DashboardSection.Controls>
        <CarEditButton
          disabled={!isCurrentUserPrimaryOwner}
          onClick={handleEditCarButtonClick}
        />
        <DialogModal ref={dialogModalRef} headingText="Edit a car">
          <CarEditForm
            carData={carData}
            carId={carId}
            onSubmit={handleCarEditFormSubmit}
          />
        </DialogModal>
      </DashboardSection.Controls>
    </DashboardSection>
  );
}
