import { useRef } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';

import { ChangeKeyIcon } from '@/components/decorative/icons/ChangeKeyIcon';
import { UserMinusIcon } from '@/components/decorative/icons/UserMinusIcon';
import { UserPlusIcon } from '@/components/decorative/icons/UserPlusIcon';

import { AddCarOwnershipForm } from '../AddCarOwnershipForm/AddCarOwnershipForm';
import { DialogModal, DialogModalRef } from '../DialogModal/DialogModal';
import { GrantCarPrimaryOwnershipForm } from '../GrantPrimaryOwnershipForm/GrantPrimaryOwnershipForm';
import { IconButton } from '../IconButton/IconButton';
import {
  RemoveCarOwnershipForm,
  RemoveCarOwnershipFormRef,
  RemoveCarOwnershipFormValues,
} from '../RemoveCarOwnershipForm/RemoveCarOwnershipForm';

type CarOwnershipControlsProps = {
  carId: string;
  removeCarOwnershipFormMethods: UseFormReturn<RemoveCarOwnershipFormValues>;
  isCurrentUserPrimaryOwner: boolean;
};

export function CarOwnershipControls({
  carId,
  removeCarOwnershipFormMethods,
  isCurrentUserPrimaryOwner,
}: CarOwnershipControlsProps) {
  const removeCarOwnershipFormRef = useRef<RemoveCarOwnershipFormRef>(null);
  const newCarOwnerFormModalRef = useRef<DialogModalRef>(null);
  const removeCarOwnershipFormModalRef = useRef<DialogModalRef>(null);
  const grantPrimaryOwnershipFormModalRef = useRef<DialogModalRef>(null);

  return (
    <div className="m-5 flex justify-end gap-5">
      <IconButton
        className="group"
        disabled={!isCurrentUserPrimaryOwner}
        title="grant primary ownership"
        onClick={() => grantPrimaryOwnershipFormModalRef.current?.showModal()}
      >
        <ChangeKeyIcon className="group-disabled:stroke-light-800 h-full w-full stroke-3" />
      </IconButton>
      <IconButton
        className="group"
        disabled={
          !removeCarOwnershipFormMethods.formState.isDirty &&
          !removeCarOwnershipFormMethods.formState.isSubmitting
        }
        title="remove selected owners"
        onClick={() => removeCarOwnershipFormModalRef.current?.showModal()}
      >
        <UserMinusIcon className="group-disabled:stroke-light-800 h-full w-full stroke-[0.5]" />
      </IconButton>
      <IconButton
        className="group"
        disabled={!isCurrentUserPrimaryOwner}
        title="add owner"
        onClick={() => newCarOwnerFormModalRef.current?.showModal()}
      >
        <UserPlusIcon className="group-disabled:stroke-light-800 h-full w-full stroke-[0.5]" />
      </IconButton>
      <DialogModal ref={grantPrimaryOwnershipFormModalRef}>
        <GrantCarPrimaryOwnershipForm
          carId={carId}
          onSubmit={() => {
            removeCarOwnershipFormRef.current?.reset();
            grantPrimaryOwnershipFormModalRef.current?.closeModal();
          }}
        />
      </DialogModal>
      <DialogModal ref={removeCarOwnershipFormModalRef}>
        <FormProvider<RemoveCarOwnershipFormValues>
          {...removeCarOwnershipFormMethods}
        >
          <RemoveCarOwnershipForm
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
      <DialogModal ref={newCarOwnerFormModalRef}>
        <AddCarOwnershipForm
          carId={carId}
          onSubmit={() => newCarOwnerFormModalRef.current?.closeModal()}
        />
      </DialogModal>
    </div>
  );
}
