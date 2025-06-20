import { useRef } from 'react';

import { ChangeKeyIcon } from '@/components/decorative/icons/ChangeKeyIcon';
import { UserPlusIcon } from '@/components/decorative/icons/UserPlusIcon';

import { CarOwnershipAddForm } from '../../forms/CarOwnershipAddForm/CarOwnershipAddForm';
import { CarPrimaryOwnershipGrantForm } from '../../forms/CarPrimaryOwnershipGrantForm/CarPrimaryOwnershipGrantForm';
import {
  DialogModal,
  DialogModalRef,
} from '../../shared/base/DialogModal/DialogModal';
import { DashboardSection } from '../../shared/DashboardSection/DashboardSection';
import { IconButton } from '../../shared/IconButton/IconButton';

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
  const grantPrimaryOwnershipFormModalRef = useRef<DialogModalRef>(null);

  return (
    <DashboardSection.Controls
      className="mt-4"
      data-testid={CAR_OWNERSHIPS_SECTION_CONTROLS_TEST_ID}
    >
      <IconButton
        className="group"
        disabled={!isCurrentUserPrimaryOwner}
        title="grant primary ownership"
        variant="accent"
        onClick={() => grantPrimaryOwnershipFormModalRef.current?.showModal()}
      >
        <ChangeKeyIcon className="group-disabled:stroke-light-800 stroke-light-500 fill-light-500 h-full w-full" />
      </IconButton>
      <DialogModal
        ref={grantPrimaryOwnershipFormModalRef}
        headingText="Grant primary ownership"
      >
        <CarPrimaryOwnershipGrantForm
          carId={carId}
          onSubmit={() => {
            grantPrimaryOwnershipFormModalRef.current?.closeModal();
          }}
        />
      </DialogModal>

      <IconButton
        className="group"
        disabled={!isCurrentUserPrimaryOwner}
        title="add ownership"
        variant="accent"
        onClick={() => newCarOwnerFormModalRef.current?.showModal()}
      >
        <UserPlusIcon className="group-disabled:stroke-light-800 h-full w-full stroke-2" />
      </IconButton>
      <DialogModal ref={newCarOwnerFormModalRef} headingText="Add a car owner">
        <CarOwnershipAddForm
          carId={carId}
          onSubmit={() => newCarOwnerFormModalRef.current?.closeModal()}
        />
      </DialogModal>
    </DashboardSection.Controls>
  );
}
