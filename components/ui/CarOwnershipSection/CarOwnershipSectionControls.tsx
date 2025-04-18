import { useRef } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';

import { ChangeKeyIcon } from '@/components/decorative/icons/ChangeKeyIcon';
import { UserMinusIcon } from '@/components/decorative/icons/UserMinusIcon';
import { UserPlusIcon } from '@/components/decorative/icons/UserPlusIcon';

import { DashboardSection } from '../DashboardSection/DashboardSection';
import { AddCarOwnershipForm } from '../forms/AddCarOwnershipForm/AddCarOwnershipForm';
import {
  CarOwnershipDeleteForm,
  CarOwnershipDeleteFormRef,
  CarOwnershipDeleteFormValues,
} from '../forms/CarOwnershipDeleteForm/CarOwnershipDeleteForm';
import { CarPrimaryOwnershipGrantForm } from '../forms/CarPrimaryOwnershipGrantForm/CarPrimaryOwnershipGrantForm';
import {
  DialogModal,
  DialogModalRef,
} from '../shared/base/DialogModal/DialogModal';
import { IconButton } from '../shared/IconButton/IconButton';

type CarOwnershipSectionControlsProps = {
  carId: string;
  removeCarOwnershipFormMethods: UseFormReturn<CarOwnershipDeleteFormValues>;
  isCurrentUserPrimaryOwner: boolean;
};

export function CarOwnershipSectionControls({
  carId,
  removeCarOwnershipFormMethods,
  isCurrentUserPrimaryOwner,
}: CarOwnershipSectionControlsProps) {
  const removeCarOwnershipFormRef = useRef<CarOwnershipDeleteFormRef>(null);
  const newCarOwnerFormModalRef = useRef<DialogModalRef>(null);
  const removeCarOwnershipFormModalRef = useRef<DialogModalRef>(null);
  const grantPrimaryOwnershipFormModalRef = useRef<DialogModalRef>(null);

  return (
    <DashboardSection.Controls className="mt-4">
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
            removeCarOwnershipFormRef.current?.reset();
            grantPrimaryOwnershipFormModalRef.current?.closeModal();
          }}
        />
      </DialogModal>

      <IconButton
        className="group"
        disabled={
          !removeCarOwnershipFormMethods.formState.isDirty &&
          !removeCarOwnershipFormMethods.formState.isSubmitting
        }
        title="remove selected owners"
        variant="accent"
        onClick={() => removeCarOwnershipFormModalRef.current?.showModal()}
      >
        <UserMinusIcon className="group-disabled:stroke-light-800 stroke-light-500 h-full w-full stroke-2" />
      </IconButton>
      <DialogModal
        ref={removeCarOwnershipFormModalRef}
        headingText="Remove ownerships"
      >
        <FormProvider<CarOwnershipDeleteFormValues>
          {...removeCarOwnershipFormMethods}
        >
          <CarOwnershipDeleteForm
            ref={removeCarOwnershipFormRef}
            carId={carId}
            isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
            onReset={() => removeCarOwnershipFormModalRef.current?.closeModal()}
            onSubmit={() =>
              removeCarOwnershipFormModalRef.current?.closeModal()
            }
          />
        </FormProvider>
      </DialogModal>

      <IconButton
        className="group"
        disabled={!isCurrentUserPrimaryOwner}
        title="add owner"
        variant="accent"
        onClick={() => newCarOwnerFormModalRef.current?.showModal()}
      >
        <UserPlusIcon className="group-disabled:stroke-light-800 h-full w-full stroke-2" />
      </IconButton>
      <DialogModal ref={newCarOwnerFormModalRef} headingText="Add a car owner">
        <AddCarOwnershipForm
          carId={carId}
          onSubmit={() => newCarOwnerFormModalRef.current?.closeModal()}
        />
      </DialogModal>
    </DashboardSection.Controls>
  );
}
