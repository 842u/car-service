import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Route } from 'next';
import { useRouter } from 'next/navigation';
import { SyntheticEvent } from 'react';

import { useToasts } from '@/hooks/useToasts';
import { deleteCar } from '@/utils/supabase/tables/cars';
import {
  carsInfiniteDeleteOnError,
  carsInfiniteDeleteOnMutate,
} from '@/utils/tanstack/cars';
import { queryKeys } from '@/utils/tanstack/keys';

import { CarDeleteFormProps } from './CarDeleteForm';

export function useCarDeleteForm({ carId, onSubmit }: CarDeleteFormProps) {
  const router = useRouter();

  const { addToast } = useToasts();

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: queryKeys.infiniteCars,
    throwOnError: false,
    mutationFn: () => deleteCar(carId),
    onMutate: () => carsInfiniteDeleteOnMutate(carId, queryClient),
    onSuccess: () => addToast('Successfully deleted a car.', 'success'),
    onError: (error, _, context) => {
      addToast(error.message, 'error');
      carsInfiniteDeleteOnError(queryClient, context);
    },
  });

  const handleFormSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate(undefined, {
      onSettled: () =>
        queryClient.invalidateQueries({
          queryKey: queryKeys.infiniteCars,
        }),
    });
    router.replace('/dashboard/cars' satisfies Route);
    onSubmit && onSubmit();
  };

  return { handleFormSubmit };
}
