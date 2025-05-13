'use client';

import { Ref } from 'react';
import { UseFormReset } from 'react-hook-form';

import { Button } from '../../shared/base/Button/Button';
import { Form } from '../../shared/base/Form/Form';
import { useCarOwnershipDeleteForm } from './useCarOwnershipDeleteForm';

export const CAR_OWNERSHIP_DELETE_FORM_TEST_ID =
  'car ownership delete form test id';

export type CarOwnershipDeleteFormRef = {
  reset: UseFormReset<CarOwnershipDeleteFormValues>;
};

export type CarOwnershipDeleteFormValues = {
  ownersIds: string[];
};

export type CarOwnershipDeleteFormProps = {
  carId: string;
  isCurrentUserPrimaryOwner: boolean;
  ref: Ref<CarOwnershipDeleteFormRef>;
  onReset?: () => void;
  onSubmit?: () => void;
};

export function CarOwnershipDeleteForm({
  carId,
  isCurrentUserPrimaryOwner,
  ref,
  onReset,
  onSubmit,
}: CarOwnershipDeleteFormProps) {
  const { handleFormSubmit, handleFormReset, isDirty, isSubmitting } =
    useCarOwnershipDeleteForm({
      carId,
      isCurrentUserPrimaryOwner,
      ref,
      onReset,
      onSubmit,
    });

  return (
    <Form
      className="gap-4"
      data-testid={CAR_OWNERSHIP_DELETE_FORM_TEST_ID}
      variant="raw"
      onSubmit={handleFormSubmit}
    >
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
