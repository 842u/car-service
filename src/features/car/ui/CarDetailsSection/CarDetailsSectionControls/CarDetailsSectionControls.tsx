import { useRef } from 'react';

import { CarEditButton } from '@/features/car/ui/CarEditButton/CarEditButton';
import { CarEditModal } from '@/features/car/ui/CarEditModal/CarEditModal';
import { DialogModalRef } from '@/features/common/ui/DialogModal/DialogModal';
import { DashboardSection } from '@/features/dashboard/ui/DashboardSection/DashboardSection';
import { Car } from '@/types';

export type CarDetailsSectionControlsProps = {
  isCurrentUserPrimaryOwner: boolean;
  carData?: Car;
};

export function CarDetailsSectionControls({
  isCurrentUserPrimaryOwner,
  carData,
}: CarDetailsSectionControlsProps) {
  const dialogRef = useRef<DialogModalRef>(null);

  const handleCarEditButtonClick = () => dialogRef.current?.showModal();

  const handleCarEditModalSubmit = () => dialogRef.current?.closeModal();

  return (
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
  );
}
