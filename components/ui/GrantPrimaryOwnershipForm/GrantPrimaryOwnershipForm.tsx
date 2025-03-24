import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useToasts } from '@/hooks/useToasts';
import { patchCarPrimaryOwnership } from '@/utils/supabase/general';
import {
  onErrorCarOwnershipPatch,
  onMutateCarOwnershipPatch,
} from '@/utils/tanstack/general';
import { validateUserId } from '@/utils/validation';

import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { SubmitButton } from '../SubmitButton/SubmitButton';

type GrantCarPrimaryOwnershipFormValues = {
  newOwnerId: string | null;
};

const defaultGrantCarPrimaryOwnershipFormValues: GrantCarPrimaryOwnershipFormValues =
  {
    newOwnerId: null,
  };

type GrantCarPrimaryOwnershipFormProps = {
  carId: string;
  onSubmit?: () => void;
};

export function GrantCarPrimaryOwnershipForm({
  carId,
  onSubmit,
}: GrantCarPrimaryOwnershipFormProps) {
  const { addToast } = useToasts();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty, isSubmitSuccessful },
  } = useForm({
    mode: 'onChange',
    defaultValues: defaultGrantCarPrimaryOwnershipFormValues,
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    throwOnError: false,
    mutationFn: (newCarOwnerFormData: GrantCarPrimaryOwnershipFormValues) =>
      patchCarPrimaryOwnership(newCarOwnerFormData.newOwnerId, carId),
    onMutate: (newCarOwnerFormData: GrantCarPrimaryOwnershipFormValues) =>
      onMutateCarOwnershipPatch(
        queryClient,
        carId,
        newCarOwnerFormData.newOwnerId,
      ),
    onSuccess: () => addToast('Successfully added new owner.', 'success'),
    onError: (error, _, context) =>
      onErrorCarOwnershipPatch(queryClient, error, context, carId, addToast),
  });

  const handleFormSubmit = handleSubmit(
    (formData: GrantCarPrimaryOwnershipFormValues) => {
      onSubmit && onSubmit();
      mutate(formData, {
        onSettled: () =>
          queryClient.invalidateQueries({
            queryKey: ['cars_ownerships', carId],
          }),
      });
    },
  );

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <form
      className="border-accent-200 dark:border-accent-300 bg-light-500 dark:bg-dark-500 rounded-xl border-2 p-10 md:max-w-lg"
      onSubmit={handleFormSubmit}
    >
      <h2>Grant primary ownership</h2>
      <div className="bg-alpha-grey-200 my-4 h-[1px] w-full" />
      <Input
        required
        errorMessage={errors.newOwnerId?.message}
        label="User ID"
        maxLength={36}
        minLength={36}
        name="newOwnerId"
        register={register}
        registerOptions={{
          validate: (data) => validateUserId(data),
        }}
        type="text"
      />
      <p className="text-warning-500 dark:text-warning-300">
        <span className="block">Warning: </span>
        <span>
          Granting primary ownership to someone else will revoke your current
          primary ownership status and the privileges that come with it.
        </span>
      </p>
      <div className="mt-5 flex justify-end gap-5">
        <Button disabled={!isDirty} onClick={() => reset()}>
          Reset
        </Button>
        <SubmitButton
          disabled={!isValid || isSubmitting}
          isSubmitting={isSubmitting}
        >
          Save
        </SubmitButton>
      </div>
    </form>
  );
}
