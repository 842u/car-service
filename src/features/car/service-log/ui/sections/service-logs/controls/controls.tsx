import { useRef } from 'react';

import { AddButton } from '@/car/service-log/ui/buttons/add/add';
import { AddModal } from '@/car/service-log/ui/modals/add/add';
import { DashboardSection } from '@/dashboard/ui/section/section';
import { DialogModalRef } from '@/ui/dialog-modal/dialog-modal';

export type SectionControlsProps = { carId: string };

export function SectionControls({ carId }: SectionControlsProps) {
  const dialogRef = useRef<DialogModalRef>(null);

  const handleAddModalSubmit = () => dialogRef.current?.closeModal();

  const handleAddButtonClick = () => dialogRef.current?.showModal();

  return (
    <DashboardSection.Controls>
      <AddButton onClick={handleAddButtonClick} />
      <AddModal ref={dialogRef} carId={carId} onSubmit={handleAddModalSubmit} />
    </DashboardSection.Controls>
  );
}
