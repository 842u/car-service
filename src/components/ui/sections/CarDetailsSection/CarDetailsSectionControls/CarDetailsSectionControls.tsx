import { useRef } from 'react';

import { CarEditButton } from '@/components/ui/buttons/CarEditButton/CarEditButton';
import { CarEditModal } from '@/components/ui/modals/CarEditModal/CarEditModal';
import { DashboardSection } from '@/components/ui/shared/DashboardSection/DashboardSection';
import { DialogModalRef } from '@/features/common/ui/DialogModal/DialogModal';
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
