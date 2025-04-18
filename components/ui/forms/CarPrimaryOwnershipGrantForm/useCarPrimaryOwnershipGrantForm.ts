import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useToasts } from '@/hooks/useToasts';
import {
  carPrimaryOwnershipGrantFormSchema,
  CarPrimaryOwnershipGrantFormValues,
} from '@/schemas/zod/carPrimaryOwnershipGrantFormSchema';
import { updateCarPrimaryOwnershipByUserId } from '@/utils/supabase/tables/cars_ownerships';
import {
  carsOwnershipsUpdateOnError,
  carsOwnershipsUpdateOnMutate,
} from '@/utils/tanstack/cars_ownerships';
import { queryKeys } from '@/utils/tanstack/keys';

import { CarPrimaryOwnershipGrantFormProps } from './CarPrimaryOwnershipGrantForm';

const defaultCarPrimaryOwnershipGrantFormValues: CarPrimaryOwnershipGrantFormValues =
  { userId: '' };

export function useCarPrimaryOwnershipGrantForm({
  carId,
  onSubmit,
}: CarPrimaryOwnershipGrantFormProps) {
  const { addToast } = useToasts();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty, isSubmitSuccessful },
  } = useForm<CarPrimaryOwnershipGrantFormValues>({
    resolver: zodResolver(carPrimaryOwnershipGrantFormSchema),
    mode: 'onChange',
    defaultValues: defaultCarPrimaryOwnershipGrantFormValues,
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    throwOnError: false,
    mutationFn: (newCarOwnerFormData: CarPrimaryOwnershipGrantFormValues) =>
      updateCarPrimaryOwnershipByUserId(newCarOwnerFormData.userId, carId),
    onMutate: (newCarOwnerFormData: CarPrimaryOwnershipGrantFormValues) =>
      carsOwnershipsUpdateOnMutate(
        queryClient,
        carId,
        newCarOwnerFormData.userId,
      ),
    onSuccess: () =>
      addToast('Successfully granted primary ownership.', 'success'),
    onError: (error, _, context) => {
      addToast(error.message, 'error');
      carsOwnershipsUpdateOnError(queryClient, context, carId);
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
    isDirty,
    isValid,
  };
}
