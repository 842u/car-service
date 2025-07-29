import { useRef } from 'react';

import { CarDeleteButton } from '@/features/car/ui/CarDeleteButton/CarDeleteButton';
import { CarDeleteModal } from '@/features/car/ui/CarDeleteModal/CarDeleteModal';
import { DialogModalRef } from '@/features/common/ui/dialog-modal/dialog-modal';
import { Section } from '@/features/dashboard/ui/section/section';

export type CarDeleteSectionControlsProps = {
  carId: string;
  isCurrentUserPrimaryOwner: boolean;
};

export function CarDeleteSectionControls({
  carId,
  isCurrentUserPrimaryOwner,
}: CarDeleteSectionControlsProps) {
  const dialogRef = useRef<DialogModalRef>(null);

  const handleCarDeleteModalCancel = () => dialogRef.current?.closeModal();

  const handleCarDeleteModalConfirm = () => dialogRef.current?.closeModal();

  const handleCarDeleteButtonClick = () => dialogRef.current?.showModal();

  return (
    <Section.Controls>
      <CarDeleteButton
        disabled={!isCurrentUserPrimaryOwner}
        onClick={handleCarDeleteButtonClick}
      />
      <CarDeleteModal
        ref={dialogRef}
        carId={carId}
        onCancel={handleCarDeleteModalCancel}
        onConfirm={handleCarDeleteModalConfirm}
      />
    </Section.Controls>
  );
}
