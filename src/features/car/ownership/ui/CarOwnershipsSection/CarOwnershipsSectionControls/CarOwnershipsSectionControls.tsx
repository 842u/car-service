import { useRef } from 'react';

import { DialogModalRef } from '@/features/common/ui/dialog-modal/dialog-modal';
import { Section } from '@/features/dashboard/ui/section/section';

import { OwnershipAddButton } from '../../OwnershipAddButton/OwnershipAddButton';
import { OwnershipAddModal } from '../../OwnershipAddModal/OwnershipAddModal';

export const CAR_OWNERSHIPS_SECTION_CONTROLS_TEST_ID =
  'car ownership section test id';

export type CarOwnershipsSectionControlsProps = {
  carId: string;
  isCurrentUserPrimaryOwner: boolean;
};

export function CarOwnershipsSectionControls({
  carId,
  isCurrentUserPrimaryOwner,
}: CarOwnershipsSectionControlsProps) {
  const dialogRef = useRef<DialogModalRef>(null);

  const handleOwnershipAddButtonClick = () => dialogRef.current?.showModal();

  const handleOwnershipAddModalSubmit = () => dialogRef.current?.closeModal();

  return (
    <Section.Controls data-testid={CAR_OWNERSHIPS_SECTION_CONTROLS_TEST_ID}>
      <OwnershipAddButton
        disabled={!isCurrentUserPrimaryOwner}
        onClick={handleOwnershipAddButtonClick}
      />
      <OwnershipAddModal
        ref={dialogRef}
        carId={carId}
        onSubmit={handleOwnershipAddModalSubmit}
      />
    </Section.Controls>
  );
}
