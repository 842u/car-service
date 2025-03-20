import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { ZodError } from 'zod';

import { useToasts } from '@/hooks/useToasts';
import { postCarOwnership } from '@/utils/supabase/general';
import { onMutateCarOwnershipPost } from '@/utils/tanstack/general';
import { validateUserId } from '@/utils/validation';

import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { SubmitButton } from '../SubmitButton/SubmitButton';

type NewCarOwnerFormValues = {
  newOwnerId: string | null;
};

const defaultNewCarOwnerFormValues: NewCarOwnerFormValues = {
  newOwnerId: null,
};

type NewCarOwnerFormProps = {
  carId: string;
};

export function NewCarOwnerForm({ carId }: NewCarOwnerFormProps) {
  const { addToast } = useToasts();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm({
    mode: 'onChange',
    defaultValues: defaultNewCarOwnerFormValues,
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (newCarOwnerFormData: NewCarOwnerFormValues) =>
      postCarOwnership(carId, newCarOwnerFormData.newOwnerId),
    onMutate: (newCarOwnerFormData: NewCarOwnerFormValues) =>
      onMutateCarOwnershipPost(
        queryClient,
        carId,
        newCarOwnerFormData.newOwnerId,
      ),
    onSuccess: () => addToast('Successfully added new owner.', 'success'),
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

  return (
    <form
      className="border-accent-200 dark:border-accent-300 bg-light-500 dark:bg-dark-500 rounded-xl border-2 p-10"
      onSubmit={handleSubmit((formData: NewCarOwnerFormValues) => {
        mutate(formData);
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
      <div className="mt-5 flex justify-evenly">
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
