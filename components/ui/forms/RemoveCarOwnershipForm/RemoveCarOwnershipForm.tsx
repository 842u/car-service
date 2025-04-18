'use client';

import { Ref } from 'react';
import { UseFormReset } from 'react-hook-form';

import { Button } from '../../shared/base/Button/Button';
import { Form } from '../../shared/base/Form/Form';
import { useRemoveCarOwnershipForm } from './useRemoveCarOwnershipForm';

export type RemoveCarOwnershipFormRef = {
  reset: UseFormReset<RemoveCarOwnershipFormValues>;
};

export type RemoveCarOwnershipFormValues = {
  ownersIds: string[];
};

export type RemoveCarOwnershipFormProps = {
  carId: string;
  isCurrentUserPrimaryOwner: boolean;
  ref: Ref<RemoveCarOwnershipFormRef>;
  onReset?: () => void;
  onSubmit?: () => void;
};

export function RemoveCarOwnershipForm({
  carId,
  isCurrentUserPrimaryOwner,
  ref,
  onReset,
  onSubmit,
}: RemoveCarOwnershipFormProps) {
  const { handleFormSubmit, handleFormReset, isDirty, isSubmitting } =
    useRemoveCarOwnershipForm({
      carId,
      isCurrentUserPrimaryOwner,
      ref,
      onReset,
      onSubmit,
    });

  return (
    <Form className="gap-4" variant="raw" onSubmit={handleFormSubmit}>
      {isCurrentUserPrimaryOwner && (
        <p>Are you sure you want to remove ownership from selected users?</p>
      )}
      {!isCurrentUserPrimaryOwner && (
        <p className="text-warning-500 dark:text-warning-300">
          <span className="block">Warning:</span>
          <span>
            You are trying to remove your ownership. Doing this will revoke your
            access to this car.
          </span>
        </p>
      )}
      <Form.Controls>
        <Button disabled={!isDirty && !isSubmitting} onClick={handleFormReset}>
          Reset
        </Button>
        <Form.ButtonSubmit disabled={!isDirty && !isSubmitting}>
          Save
        </Form.ButtonSubmit>
      </Form.Controls>
    </Form>
  );
}
