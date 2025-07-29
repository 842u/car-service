import { useRef } from 'react';

import { CarEditButton } from '@/features/car/ui/CarEditButton/CarEditButton';
import { CarEditModal } from '@/features/car/ui/CarEditModal/CarEditModal';
import { DialogModalRef } from '@/features/common/ui/dialog-modal/dialog-modal';
import { Section } from '@/features/dashboard/ui/section/section';
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
    <Section.Controls>
      <CarEditButton
        disabled={!isCurrentUserPrimaryOwner}
        onClick={handleCarEditButtonClick}
      />
      <CarEditModal
        ref={dialogRef}
        carData={carData}
        onSubmit={handleCarEditModalSubmit}
      />
    </Section.Controls>
  );
}
