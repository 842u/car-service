import { useRef } from 'react';

import { AddButton } from '@/car/ownership/ui/buttons/add/add';
import { AddModal } from '@/car/ownership/ui/modals/add/add';
import { DashboardSection } from '@/dashboard/ui/section/section';
import { DialogModalRef } from '@/ui/dialog-modal/dialog-modal';

export const SECTION_CONTROLS_TEST_ID = 'car ownership section test id';

export type SectionControlsProps = {
  carId: string;
  isCurrentUserPrimaryOwner: boolean;
};

export function SectionControls({
  carId,
  isCurrentUserPrimaryOwner,
}: SectionControlsProps) {
  const dialogRef = useRef<DialogModalRef>(null);

  const handleOwnershipAddButtonClick = () => dialogRef.current?.showModal();

  const handleOwnershipAddModalSubmit = () => dialogRef.current?.closeModal();

  return (
    <DashboardSection.Controls data-testid={SECTION_CONTROLS_TEST_ID}>
      <AddButton
        disabled={!isCurrentUserPrimaryOwner}
        onClick={handleOwnershipAddButtonClick}
      />
      <AddModal
        ref={dialogRef}
        carId={carId}
        onSubmit={handleOwnershipAddModalSubmit}
      />
    </DashboardSection.Controls>
  );
}
