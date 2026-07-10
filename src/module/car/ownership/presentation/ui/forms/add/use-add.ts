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

  const { mutate } = useMutation(ownershipAddMutationOptions(queryClient));

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  const handleFormSubmit = handleSubmit(({ ownerId }) => {
    onSubmit && onSubmit();
    mutate(
      { carId, ownerId },
      {
        onSuccess: () => addToast('Owner added.', 'success'),
        onError: (error) => addToast(error.message, 'error'),
      },
    );
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
