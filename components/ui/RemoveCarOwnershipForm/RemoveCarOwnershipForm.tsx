'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Route } from 'next';
import { useRouter } from 'next/navigation';
import { Ref, useEffect, useImperativeHandle } from 'react';
import { useFormContext, UseFormReset } from 'react-hook-form';

import { useToasts } from '@/hooks/useToasts';
import { deleteCarOwnershipsByUsersIds } from '@/utils/supabase/general';
import { carsOwnershipsDeleteOnMutate } from '@/utils/tanstack/cars_ownerships';
import { queryKeys } from '@/utils/tanstack/keys';

import { Button } from '../Button/Button';

export type RemoveCarOwnershipFormRef = {
  reset: UseFormReset<RemoveCarOwnershipFormValues>;
};

export type RemoveCarOwnershipFormValues = {
  ownersIds: string[];
};

type RemoveCarOwnershipFormProps = {
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
  const router = useRouter();

  const { addToast } = useToasts();

  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    throwOnError: false,
    mutationFn: (carOwnershipFormData: RemoveCarOwnershipFormValues) =>
      deleteCarOwnershipsByUsersIds(carId, carOwnershipFormData.ownersIds),
    onMutate: (carOwnershipFormData: RemoveCarOwnershipFormValues) =>
      carsOwnershipsDeleteOnMutate(carOwnershipFormData, queryClient, carId),
    onSuccess: () => {
      addToast('Successfully removed ownerships.', 'success');
    },
    onError: (error, _, context) => {
      addToast(error.message, 'error');
      queryClient.setQueryData(
        queryKeys.carsOwnershipsByCarId(carId),
        context?.previousQueryData,
      );
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.carsOwnershipsByCarId(carId),
      }),
  });

  const {
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting, isSubmitSuccessful },
  } = useFormContext<RemoveCarOwnershipFormValues>();

  const handleFormSubmit = async (data: RemoveCarOwnershipFormValues) => {
    onSubmit && onSubmit();
    await mutateAsync(data);
    !isCurrentUserPrimaryOwner &&
      router.replace('/dashboard/cars' satisfies Route);
  };

  useImperativeHandle(ref, () => ({ reset }), [reset]);

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
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
            onClick={() => {
              onReset && onReset();
              reset();
            }}
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
