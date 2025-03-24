'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { useToasts } from '@/hooks/useToasts';
import { deleteCarOwnershipsByOwnersIds } from '@/utils/supabase/general';
import { onMutateCarOwnershipDelete } from '@/utils/tanstack/general';

import { Button } from '../Button/Button';

export type RemoveCarOwnershipFormValues = {
  ownersIds: string[];
};

type RemoveCarOwnershipFormProps = {
  carId: string;
  onReset?: () => void;
  onSubmit?: () => void;
};

export function RemoveCarOwnershipForm({
  carId,
  onReset,
  onSubmit,
}: RemoveCarOwnershipFormProps) {
  const { addToast } = useToasts();

  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: (carOwnershipFormData: RemoveCarOwnershipFormValues) =>
      deleteCarOwnershipsByOwnersIds(carId, carOwnershipFormData.ownersIds),
    onMutate: (carOwnershipFormData: RemoveCarOwnershipFormValues) =>
      onMutateCarOwnershipDelete(carOwnershipFormData, queryClient, carId),
    onSuccess: () => {
      addToast('Successfully removed ownerships.', 'success');
    },
    onError: (error, _, context) => {
      addToast(error.message, 'error');
      queryClient.setQueryData(
        ['ownership', carId],
        context?.previousQueryData,
      );
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ['ownership', carId] }),
  });

  const {
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting, isSubmitSuccessful },
  } = useFormContext<RemoveCarOwnershipFormValues>();

  const handleFormSubmit = async (data: RemoveCarOwnershipFormValues) => {
    await mutateAsync(data);
  };

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="border-accent-200 dark:border-accent-300 bg-light-500 dark:bg-dark-500 max-w-md rounded-xl border-2 p-10">
        <h2>Remove ownership</h2>
        <div className="bg-alpha-grey-200 my-4 h-[1px] w-full" />
        <p>Are you sure you want to remove ownership from selected users?</p>
        <div className="mt-5 flex justify-evenly">
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
            onClick={() => {
              onSubmit && onSubmit();
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
}
