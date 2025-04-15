'use client';

import { Ref } from 'react';
import { UseFormReset } from 'react-hook-form';

import { Button } from '../Button/Button';
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
    <form onSubmit={handleFormSubmit}>
      <div className="border-accent-200 dark:border-accent-300 bg-light-500 dark:bg-dark-500 max-w-md rounded-xl border-2 p-10">
        <h2>Remove ownership</h2>
        <div className="bg-alpha-grey-200 my-4 h-[1px] w-full" />
        {isCurrentUserPrimaryOwner && (
          <p>Are you sure you want to remove ownership from selected users?</p>
        )}
        {!isCurrentUserPrimaryOwner && (
          <p className="text-warning-500 dark:text-warning-300">
            <span className="block">Warning:</span>
            <span>
              You are trying to remove your ownership. Doing this will revoke
              your access to this car.
            </span>
          </p>
        )}
        <div className="mt-5 flex justify-end gap-5">
          <Button
            disabled={!isDirty && !isSubmitting}
            onClick={handleFormReset}
          >
            Reset
          </Button>
          <Button
            className="border-accent-500 bg-accent-800 disabled:border-accent-700 disabled:bg-accent-900 disabled:text-light-800"
            disabled={!isDirty && !isSubmitting}
            type="submit"
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
}
