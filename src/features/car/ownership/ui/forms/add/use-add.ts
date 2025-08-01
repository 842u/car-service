import { zodResolver } from '@hookform/resolvers/zod';
import type { QueryClient } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useToasts } from '@/common/hooks/use-toasts';
import type { CarOwnershipAddFormValues } from '@/schemas/zod/carOwnershipAddFormSchema';
import { carOwnershipAddFormSchema } from '@/schemas/zod/carOwnershipAddFormSchema';
import { addCarOwnershipByUserId } from '@/utils/supabase/tables/cars_ownerships';
import {
  carsOwnershipsAddOnError,
  carsOwnershipsAddOnMutate,
} from '@/utils/tanstack/cars_ownerships';
import { queryKeys } from '@/utils/tanstack/keys';

import type { AddFormProps } from './add';

type MutationVariables = {
  formData: CarOwnershipAddFormValues;
  carId: string;
  queryClient: QueryClient;
};

const defaultAddFormValues: CarOwnershipAddFormValues = {
  userId: '',
};

export function useAddForm({ carId, onSubmit }: AddFormProps) {
  const { addToast } = useToasts();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty, isSubmitSuccessful },
  } = useForm<CarOwnershipAddFormValues>({
    resolver: zodResolver(carOwnershipAddFormSchema),
    mode: 'onChange',
    defaultValues: defaultAddFormValues,
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    throwOnError: false,
    mutationFn: ({ formData: { userId } }: MutationVariables) =>
      addCarOwnershipByUserId(carId, userId),
    onMutate: ({ queryClient, carId, formData: { userId } }) =>
      carsOwnershipsAddOnMutate(queryClient, carId, userId),
    onSuccess: () => addToast('Owner added.', 'success'),
    onError: (error, { queryClient, carId }, context) => {
      addToast(error.message, 'error');
      carsOwnershipsAddOnError(queryClient, context, carId);
    },
  });

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  const handleFormSubmit = handleSubmit((formData) => {
    onSubmit && onSubmit();
    mutate(
      { formData, carId, queryClient },
      {
        onSettled: (_, __, { queryClient, carId }) => {
          queryClient.invalidateQueries({
            queryKey: queryKeys.carsOwnershipsByCarId(carId),
          });

          queryClient.invalidateQueries({
            queryKey: queryKeys.profilesOwners,
          });
        },
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
