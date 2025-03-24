import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ZodError } from 'zod';

import { useToasts } from '@/hooks/useToasts';
import { postCarOwnership } from '@/utils/supabase/general';
import {
  onErrorCarOwnershipPost,
  onMutateCarOwnershipPost,
} from '@/utils/tanstack/general';
import { validateUserId } from '@/utils/validation';

import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { SubmitButton } from '../SubmitButton/SubmitButton';

type AddCarOwnershipFormValues = {
  newOwnerId: string | null;
};

const defaultAddCarOwnershipFormValues: AddCarOwnershipFormValues = {
  newOwnerId: null,
};

type AddCarOwnershipFormProps = {
  carId: string;
  onSubmit?: () => void;
};

export function AddCarOwnershipForm({
  carId,
  onSubmit,
}: AddCarOwnershipFormProps) {
  const { addToast } = useToasts();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty, isSubmitSuccessful },
  } = useForm({
    mode: 'onChange',
    defaultValues: defaultAddCarOwnershipFormValues,
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (addCarOwnershipFormData: AddCarOwnershipFormValues) =>
      postCarOwnership(carId, addCarOwnershipFormData.newOwnerId),
    onMutate: (addCarOwnershipFormData: AddCarOwnershipFormValues) =>
      onMutateCarOwnershipPost(
        queryClient,
        carId,
        addCarOwnershipFormData.newOwnerId,
      ),
    onSuccess: () => addToast('Successfully added new ownership.', 'success'),
    onError: (error, _, context) =>
      onErrorCarOwnershipPost(queryClient, error, context, carId, addToast),
  });

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <form
      className="border-accent-200 dark:border-accent-300 bg-light-500 dark:bg-dark-500 rounded-xl border-2 p-10"
      onSubmit={handleSubmit((formData: AddCarOwnershipFormValues) => {
        onSubmit && onSubmit();
        mutate(formData, {
          onSettled: () =>
            queryClient.invalidateQueries({ queryKey: ['ownership', carId] }),
        });
      })}
    >
      <h2>Add new car owner</h2>
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
          validate: (data) => {
            try {
              validateUserId(data);
              return true;
            } catch (error) {
              if (error instanceof ZodError) return error.issues[0].message;
              if (error instanceof Error) return error.message;
            }
          },
        }}
        type="text"
      />
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
