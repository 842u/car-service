import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { ownershipAddMutationOptions } from '@/car/ownership/infrastructure/tanstack/mutation-options/add';
import {
  addOwnerFormSchema,
  type AddOwnerFormValues,
} from '@/car/ownership/interface/ui/add-form.schema';
import { useToasts } from '@/common/presentation/hook/use-toasts';

import type { AddFormProps } from './add';

const defaultAddFormValues: AddOwnerFormValues = {
  ownerId: '',
};

export function useAddForm({ carId, onSubmit }: AddFormProps) {
  const { addToast } = useToasts();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty, isSubmitSuccessful },
  } = useForm<AddOwnerFormValues>({
    resolver: zodResolver(addOwnerFormSchema),
    mode: 'onChange',
    defaultValues: defaultAddFormValues,
  });

  const queryClient = useQueryClient();

  // onSubmit closes the add modal, unmounting this form before the request
  // settles. React Query drops callbacks passed to mutate() once the caller
  // unmounts, so the toasts live on the mutation options (which still run).
  // onError is composed so the options' optimistic rollback still runs.
  const addMutationOptions = ownershipAddMutationOptions(queryClient);

  const { mutate } = useMutation({
    ...addMutationOptions,
    onSuccess: () => addToast('Owner added.', 'success'),
    onError: (...args) => {
      addMutationOptions.onError?.(...args);
      addToast(args[0].message, 'error');
    },
  });

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  const handleFormSubmit = handleSubmit(({ ownerId }) => {
    onSubmit && onSubmit();
    mutate({ carId, ownerId });
  });

  const handleFormReset = () => reset();

  return {
    handleFormSubmit,
    handleFormReset,
    register,
    errors,
    isSubmitting,
    isValid,
    isDirty,
  };
}
