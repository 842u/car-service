import { useRef } from 'react';

import { AddButton } from '@/car/ownership/ui/buttons/add/add';
import { AddModal } from '@/car/ownership/ui/modals/add/add';
import { Section } from '@/dashboard/ui/section/section';
import { DialogModalRef } from '@/ui/dialog-modal/dialog-modal';

export const CAR_OWNERSHIPS_SECTION_CONTROLS_TEST_ID =
  'car ownership section test id';

export type ControlsProps = {
  carId: string;
  isCurrentUserPrimaryOwner: boolean;
};

export function Controls({ carId, isCurrentUserPrimaryOwner }: ControlsProps) {
  const dialogRef = useRef<DialogModalRef>(null);

  const handleOwnershipAddButtonClick = () => dialogRef.current?.showModal();

  const handleOwnershipAddModalSubmit = () => dialogRef.current?.closeModal();

  return (
    <Section.Controls data-testid={CAR_OWNERSHIPS_SECTION_CONTROLS_TEST_ID}>
      <AddButton
        disabled={!isCurrentUserPrimaryOwner}
        onClick={handleOwnershipAddButtonClick}
      />
      <AddModal
        ref={dialogRef}
        carId={carId}
        onSubmit={handleOwnershipAddModalSubmit}
      />
    </Section.Controls>
  );
}
