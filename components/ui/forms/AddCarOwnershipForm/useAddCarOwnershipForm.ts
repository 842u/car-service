import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useToasts } from '@/hooks/useToasts';
import {
  addCarOwnershipFormSchema,
  AddCarOwnershipFormValues,
} from '@/schemas/zod/addCarOwnershipFormSchema';
import { addCarOwnershipByUserId } from '@/utils/supabase/tables/cars_ownerships';
import {
  carsOwnershipsAddOnError,
  carsOwnershipsAddOnMutate,
} from '@/utils/tanstack/cars_ownerships';
import { queryKeys } from '@/utils/tanstack/keys';

import { AddCarOwnershipFormProps } from './AddCarOwnershipForm';

const defaultAddCarOwnershipFormValues: AddCarOwnershipFormValues = {
  userId: '',
};

export function useAddCarOwnershipForm({
  carId,
  onSubmit,
}: AddCarOwnershipFormProps) {
  const { addToast } = useToasts();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty, isSubmitSuccessful },
  } = useForm<AddCarOwnershipFormValues>({
    resolver: zodResolver(addCarOwnershipFormSchema),
    mode: 'onChange',
    defaultValues: defaultAddCarOwnershipFormValues,
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    throwOnError: false,
    mutationFn: (addCarOwnershipFormData: AddCarOwnershipFormValues) =>
      addCarOwnershipByUserId(carId, addCarOwnershipFormData.userId),
    onMutate: (addCarOwnershipFormData: AddCarOwnershipFormValues) =>
      carsOwnershipsAddOnMutate(
        queryClient,
        carId,
        addCarOwnershipFormData.userId,
      ),
    onSuccess: () => addToast('Successfully added new ownership.', 'success'),
    onError: (error, _, context) => {
      addToast(error.message, 'error');
      carsOwnershipsAddOnError(queryClient, context, carId);
    },
  });

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  const handleFormSubmit = handleSubmit((formData) => {
    onSubmit && onSubmit();
    mutate(formData, {
      onSettled: () =>
        queryClient.invalidateQueries({
          queryKey: queryKeys.carsOwnershipsByCarId(carId),
        }),
    });
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
