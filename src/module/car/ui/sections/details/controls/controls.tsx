import { useRef } from 'react';

import { EditButton } from '@/car/ui/buttons/edit/edit';
import { EditModal } from '@/car/ui/modals/edit/edit';
import { DashboardSection } from '@/dashboard/ui/section/section';
import type { Car } from '@/types';
import type { DialogModalRef } from '@/ui/dialog-modal/dialog-modal';

interface SectionControlsProps {
  canEdit: boolean;
  car?: Car;
}

export function SectionControls({ canEdit, car }: SectionControlsProps) {
  const dialogRef = useRef<DialogModalRef>(null);

  const handleEditButtonClick = () => dialogRef.current?.showModal();

  const handleEditModalSubmit = () => dialogRef.current?.closeModal();

  return (
    <DashboardSection.Controls>
      <EditButton disabled={!canEdit} onClick={handleEditButtonClick} />
      <EditModal ref={dialogRef} car={car} onSubmit={handleEditModalSubmit} />
    </DashboardSection.Controls>
  );
}
