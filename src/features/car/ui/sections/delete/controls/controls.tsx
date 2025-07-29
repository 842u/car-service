import { useRef } from 'react';

import { DeleteButton } from '@/car/ui/buttons/delete/delete';
import { DeleteModal } from '@/car/ui/modals/delete/delete';
import { Section } from '@/dashboard/ui/section/section';
import { DialogModalRef } from '@/ui/dialog-modal/dialog-modal';

export type ControlsProps = {
  carId: string;
  isCurrentUserPrimaryOwner: boolean;
};

export function Controls({ carId, isCurrentUserPrimaryOwner }: ControlsProps) {
  const dialogRef = useRef<DialogModalRef>(null);

  const handleCarDeleteModalCancel = () => dialogRef.current?.closeModal();

  const handleCarDeleteModalConfirm = () => dialogRef.current?.closeModal();

  const handleCarDeleteButtonClick = () => dialogRef.current?.showModal();

  return (
    <Section.Controls>
      <DeleteButton
        disabled={!isCurrentUserPrimaryOwner}
        onClick={handleCarDeleteButtonClick}
      />
      <DeleteModal
        ref={dialogRef}
        carId={carId}
        onCancel={handleCarDeleteModalCancel}
        onConfirm={handleCarDeleteModalConfirm}
      />
    </Section.Controls>
  );
}
