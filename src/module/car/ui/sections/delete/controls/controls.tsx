import { useRef } from 'react';

import { DeleteButton } from '@/car/ui/buttons/delete/delete';
import { DeleteModal } from '@/car/ui/modals/delete/delete';
import { DashboardSection } from '@/dashboard/ui/section/section';
import type { DialogModalRef } from '@/ui/dialog-modal/dialog-modal';

interface SectionControlsProps {
  carId: string;
  canDelete: boolean;
}

export function SectionControls({ carId, canDelete }: SectionControlsProps) {
  const dialogRef = useRef<DialogModalRef>(null);

  const handleDeleteModalCancel = () => dialogRef.current?.closeModal();

  const handleDeleteModalConfirm = () => dialogRef.current?.closeModal();

  const handleDeleteButtonClick = () => dialogRef.current?.showModal();

  return (
    <DashboardSection.Controls>
      <DeleteButton disabled={!canDelete} onClick={handleDeleteButtonClick} />
      <DeleteModal
        ref={dialogRef}
        carId={carId}
        onCancel={handleDeleteModalCancel}
        onConfirm={handleDeleteModalConfirm}
      />
    </DashboardSection.Controls>
  );
}
