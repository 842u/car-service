import { useRef } from 'react';

import { DialogModalRef } from '../../../../../features/common/ui/DialogModal/DialogModal';
import { DashboardSection } from '../../../../../features/dashboard/ui/DashboardSection/DashboardSection';
import { OwnershipAddButton } from '../../../buttons/OwnershipAddButton/OwnershipAddButton';
import { OwnershipAddModal } from '../../../modals/OwnershipAddModal/OwnershipAddModal';

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
    <DashboardSection.Controls
      data-testid={CAR_OWNERSHIPS_SECTION_CONTROLS_TEST_ID}
    >
      <OwnershipAddButton
        disabled={!isCurrentUserPrimaryOwner}
        onClick={handleOwnershipAddButtonClick}
      />
      <OwnershipAddModal
        ref={dialogRef}
        carId={carId}
        onSubmit={handleOwnershipAddModalSubmit}
      />
    </DashboardSection.Controls>
  );
}
