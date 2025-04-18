import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useToasts } from '@/hooks/useToasts';
import {
  grantCarPrimaryOwnershipFormSchema,
  GrantCarPrimaryOwnershipFormValues,
} from '@/schemas/zod/grantPrimaryOwnershipFormSchema';
import { updateCarPrimaryOwnershipByUserId } from '@/utils/supabase/tables/cars_ownerships';
import {
  carsOwnershipsUpdateOnError,
  carsOwnershipsUpdateOnMutate,
} from '@/utils/tanstack/cars_ownerships';
import { queryKeys } from '@/utils/tanstack/keys';

import { GrantCarPrimaryOwnershipFormProps } from './GrantPrimaryOwnershipForm';

const defaultGrantCarPrimaryOwnershipFormValues: GrantCarPrimaryOwnershipFormValues =
  { userId: '' };

export function useGrantPrimaryOwnershipForm({
  carId,
  onSubmit,
}: GrantCarPrimaryOwnershipFormProps) {
  const { addToast } = useToasts();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty, isSubmitSuccessful },
  } = useForm<GrantCarPrimaryOwnershipFormValues>({
    resolver: zodResolver(grantCarPrimaryOwnershipFormSchema),
    mode: 'onChange',
    defaultValues: defaultGrantCarPrimaryOwnershipFormValues,
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    throwOnError: false,
    mutationFn: (newCarOwnerFormData: GrantCarPrimaryOwnershipFormValues) =>
      updateCarPrimaryOwnershipByUserId(newCarOwnerFormData.userId, carId),
    onMutate: (newCarOwnerFormData: GrantCarPrimaryOwnershipFormValues) =>
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
