import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useToasts } from '@/hooks/useToasts';
import {
  addCarOwnershipFormSchema,
  AddCarOwnershipFormValues,
} from '@/schemas/zod/addCarOwnershipFormSchema';
import { postCarOwnership } from '@/utils/supabase/general';
import {
  onErrorCarOwnershipPost,
  onMutateCarOwnershipPost,
} from '@/utils/tanstack/general';

import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { SubmitButton } from '../SubmitButton/SubmitButton';

const defaultAddCarOwnershipFormValues: AddCarOwnershipFormValues = {
  userId: '',
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
    resolver: zodResolver(addCarOwnershipFormSchema),
    mode: 'onChange',
    defaultValues: defaultAddCarOwnershipFormValues,
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    throwOnError: false,
    mutationFn: (addCarOwnershipFormData: AddCarOwnershipFormValues) =>
      postCarOwnership(carId, addCarOwnershipFormData.userId),
    onMutate: (addCarOwnershipFormData: AddCarOwnershipFormValues) =>
      onMutateCarOwnershipPost(
        queryClient,
        carId,
        addCarOwnershipFormData.userId,
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
            queryClient.invalidateQueries({
              queryKey: ['cars_ownerships', carId],
            }),
        });
      })}
    >
      <h2>Add new car owner</h2>
      <div className="bg-alpha-grey-200 my-4 h-[1px] w-full" />
      <Input
        required
        errorMessage={errors.userId?.message}
        label="User ID"
        maxLength={36}
        minLength={36}
        name="userId"
        register={register}
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
