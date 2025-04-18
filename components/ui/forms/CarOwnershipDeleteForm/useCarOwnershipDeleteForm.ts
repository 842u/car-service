import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect, useImperativeHandle } from 'react';
import { useFormContext } from 'react-hook-form';

import { useToasts } from '@/hooks/useToasts';
import { deleteCarOwnershipsByUsersIds } from '@/utils/supabase/tables/cars_ownerships';
import { carsOwnershipsDeleteOnMutate } from '@/utils/tanstack/cars_ownerships';
import { queryKeys } from '@/utils/tanstack/keys';

import {
  CarOwnershipDeleteFormProps,
  CarOwnershipDeleteFormValues,
} from './CarOwnershipDeleteForm';

export function useCarOwnershipDeleteForm({
  carId,
  ref,
  isCurrentUserPrimaryOwner,
  onSubmit,
  onReset,
}: CarOwnershipDeleteFormProps) {
  const router = useRouter();

  const { addToast } = useToasts();

  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    throwOnError: false,
    mutationFn: (carOwnershipFormData: CarOwnershipDeleteFormValues) =>
      deleteCarOwnershipsByUsersIds(carId, carOwnershipFormData.ownersIds),
    onMutate: (carOwnershipFormData: CarOwnershipDeleteFormValues) =>
      carsOwnershipsDeleteOnMutate(carOwnershipFormData, queryClient, carId),
    onSuccess: () => {
      addToast('Successfully removed ownerships.', 'success');
    },
    onError: (error, _, context) => {
      addToast(error.message, 'error');
      queryClient.setQueryData(
        queryKeys.carsOwnershipsByCarId(carId),
        context?.previousQueryData,
      );
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.carsOwnershipsByCarId(carId),
      }),
  });

  const {
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting, isSubmitSuccessful },
  } = useFormContext<CarOwnershipDeleteFormValues>();

  useImperativeHandle(ref, () => ({ reset }), [reset]);

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  const handleFormSubmit = handleSubmit(async (data) => {
    onSubmit && onSubmit();
    await mutateAsync(data);
    !isCurrentUserPrimaryOwner &&
      router.replace('/dashboard/cars' satisfies Route);
  });

  const handleFormReset = () => {
    onReset && onReset();
    reset();
  };

  return { handleFormSubmit, handleFormReset, isDirty, isSubmitting };
}
