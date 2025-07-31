import { useRef } from 'react';

import { AddButton } from '@/car/ownership/ui/buttons/add/add';
import { AddModal } from '@/car/ownership/ui/modals/add/add';
import { DashboardSection } from '@/dashboard/ui/section/section';
import { DialogModalRef } from '@/ui/dialog-modal/dialog-modal';

export const SECTION_CONTROLS_TEST_ID = 'section-controls';

export type SectionControlsProps = {
  carId: string;
  isCurrentUserPrimaryOwner: boolean;
};

export function SectionControls({
  carId,
  isCurrentUserPrimaryOwner,
}: SectionControlsProps) {
  const dialogRef = useRef<DialogModalRef>(null);

  const handleAddButtonClick = () => dialogRef.current?.showModal();

  const handleAddModalSubmit = () => dialogRef.current?.closeModal();

  return (
    <DashboardSection.Controls data-testid={SECTION_CONTROLS_TEST_ID}>
      <AddButton
        disabled={!isCurrentUserPrimaryOwner}
        onClick={handleAddButtonClick}
      />
      <AddModal ref={dialogRef} carId={carId} onSubmit={handleAddModalSubmit} />
    </DashboardSection.Controls>
  );
}
