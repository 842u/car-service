import { useRef } from 'react';

import { EditButton } from '@/car/ui/buttons/edit/edit';
import { EditModal } from '@/car/ui/modals/edit/edit';
import { Section } from '@/dashboard/ui/section/section';
import { Car } from '@/types';
import { DialogModalRef } from '@/ui/dialog-modal/dialog-modal';

export type ControlsProps = {
  isCurrentUserPrimaryOwner: boolean;
  carData?: Car;
};

export function Controls({
  isCurrentUserPrimaryOwner,
  carData,
}: ControlsProps) {
  const dialogRef = useRef<DialogModalRef>(null);

  const handleCarEditButtonClick = () => dialogRef.current?.showModal();

  const handleCarEditModalSubmit = () => dialogRef.current?.closeModal();

  return (
    <Section.Controls>
      <EditButton
        disabled={!isCurrentUserPrimaryOwner}
        onClick={handleCarEditButtonClick}
      />
      <EditModal
        ref={dialogRef}
        carData={carData}
        onSubmit={handleCarEditModalSubmit}
      />
    </Section.Controls>
  );
}
