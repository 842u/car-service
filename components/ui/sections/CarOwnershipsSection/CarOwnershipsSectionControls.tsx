import { useRef } from 'react';

import { OwnershipAddButton } from '../../buttons/OwnershipAddButton/OwnershipAddButton';
import { CarOwnershipAddForm } from '../../forms/CarOwnershipAddForm/CarOwnershipAddForm';
import {
  DialogModal,
  DialogModalRef,
} from '../../shared/base/DialogModal/DialogModal';
import { DashboardSection } from '../../shared/DashboardSection/DashboardSection';

export const CAR_OWNERSHIPS_SECTION_CONTROLS_TEST_ID =
  'car ownership section test id';

type CarOwnershipsSectionControlsProps = {
  carId: string;
  isCurrentUserPrimaryOwner: boolean;
};

export function CarOwnershipsSectionControls({
  carId,
  isCurrentUserPrimaryOwner,
}: CarOwnershipsSectionControlsProps) {
  const newCarOwnerFormModalRef = useRef<DialogModalRef>(null);

  const handleOwnershipAddButtonClick = () =>
    newCarOwnerFormModalRef.current?.showModal();

  const handleCarOwnershipAddFormSubmit = () =>
    newCarOwnerFormModalRef.current?.closeModal();

  return (
    <DashboardSection.Controls
      className="mt-4"
      data-testid={CAR_OWNERSHIPS_SECTION_CONTROLS_TEST_ID}
    >
      <OwnershipAddButton
        disabled={!isCurrentUserPrimaryOwner}
        onClick={handleOwnershipAddButtonClick}
      />
      <DialogModal ref={newCarOwnerFormModalRef} headingText="Add owner">
        <CarOwnershipAddForm
          carId={carId}
          onSubmit={handleCarOwnershipAddFormSubmit}
        />
      </DialogModal>
    </DashboardSection.Controls>
  );
}
