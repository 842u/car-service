import { useRef } from 'react';

import { EditButton } from '@/car/ui/buttons/edit/edit';
import { EditModal } from '@/car/ui/modals/edit/edit';
import { DashboardSection } from '@/dashboard/ui/section/section';
import { Car } from '@/types';
import { DialogModalRef } from '@/ui/dialog-modal/dialog-modal';

export type SectionControlsProps = {
  isCurrentUserPrimaryOwner: boolean;
  carData?: Car;
};

export function SectionControls({
  isCurrentUserPrimaryOwner,
  carData,
}: SectionControlsProps) {
  const dialogRef = useRef<DialogModalRef>(null);

  const handleEditButtonClick = () => dialogRef.current?.showModal();

  const handleEditModalSubmit = () => dialogRef.current?.closeModal();

  return (
    <DashboardSection.Controls>
      <EditButton
        disabled={!isCurrentUserPrimaryOwner}
        onClick={handleEditButtonClick}
      />
      <EditModal
        ref={dialogRef}
        carData={carData}
        onSubmit={handleEditModalSubmit}
      />
    </DashboardSection.Controls>
  );
}
