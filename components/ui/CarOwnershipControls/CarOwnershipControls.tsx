import { useRef } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';

import { ChangeKeyIcon } from '@/components/decorative/icons/ChangeKeyIcon';
import { UserMinusIcon } from '@/components/decorative/icons/UserMinusIcon';
import { UserPlusIcon } from '@/components/decorative/icons/UserPlusIcon';

import { AddCarOwnershipForm } from '../AddCarOwnershipForm/AddCarOwnershipForm';
import { Button } from '../Button/Button';
import { DialogModal, DialogModalRef } from '../DialogModal/DialogModal';
import { GrantCarPrimaryOwnershipForm } from '../GrantPrimaryOwnershipForm/GrantPrimaryOwnershipForm';
import {
  RemoveCarOwnershipForm,
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
  const newCarOwnerFormModalRef = useRef<DialogModalRef>(null);
  const removeCarOwnershipFormModalRef = useRef<DialogModalRef>(null);
  const grantPrimaryOwnershipFormModalRef = useRef<DialogModalRef>(null);

  return (
    <>
      <DialogModal ref={grantPrimaryOwnershipFormModalRef}>
        <GrantCarPrimaryOwnershipForm
          carId={carId}
          onSubmit={() =>
            grantPrimaryOwnershipFormModalRef.current?.closeModal()
          }
        />
      </DialogModal>
      <DialogModal ref={removeCarOwnershipFormModalRef}>
        <FormProvider<RemoveCarOwnershipFormValues>
          {...removeCarOwnershipFormMethods}
        >
          <RemoveCarOwnershipForm
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
      <div className="m-5 flex justify-end gap-5">
        <Button
          className="border-accent-500 bg-accent-800 disabled:border-accent-700 disabled:bg-accent-900 disabled:text-light-800 cursor-pointer p-1.5"
          disabled={!isCurrentUserPrimaryOwner}
          title="Grant primary ownership"
          onClick={() => grantPrimaryOwnershipFormModalRef.current?.showModal()}
        >
          <ChangeKeyIcon className="stroke-light-500 mx-2 h-full w-full stroke-7" />
          <span className="sr-only">Grant primary ownership</span>
        </Button>
        <Button
          className="border-accent-500 bg-accent-800 disabled:border-accent-700 disabled:bg-accent-900 disabled:text-light-800 cursor-pointer p-1.5"
          disabled={
            !removeCarOwnershipFormMethods.formState.isDirty &&
            !removeCarOwnershipFormMethods.formState.isSubmitting
          }
          title="Remove selected owners"
          onClick={() => removeCarOwnershipFormModalRef.current?.showModal()}
        >
          <UserMinusIcon className="stroke-light-500 mx-2 h-full w-full" />
          <span className="sr-only">Remove selected owners</span>
        </Button>
        <Button
          className="border-accent-500 bg-accent-800 disabled:border-accent-700 disabled:bg-accent-900 disabled:text-light-800 cursor-pointer p-1.5"
          disabled={!isCurrentUserPrimaryOwner}
          title="Add owner"
          onClick={() => newCarOwnerFormModalRef.current?.showModal()}
        >
          <UserPlusIcon className="stroke-light-500 mx-2 h-full w-full" />
          <span className="sr-only">Add owner</span>
        </Button>
      </div>
    </>
  );
}
