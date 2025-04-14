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

import { SubmitButton } from '../SubmitButton/SubmitButton';

type CarDeleteFormProps = {
  carId: string;
  onSubmit: () => void;
};

export function CarDeleteForm({ carId, onSubmit }: CarDeleteFormProps) {
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

  return (
    <form
      className="border-accent-200 dark:border-accent-300 bg-light-500 dark:bg-dark-500 rounded-xl border-2 p-10"
      onSubmit={handleFormSubmit}
    >
      <h2>Delete a car</h2>
      <div className="bg-alpha-grey-200 my-4 h-[1px] w-full" />
      <p className="my-5">Are you sure you want permanently delete this car?</p>
      <SubmitButton className="mr-0 ml-auto">Delete</SubmitButton>
    </form>
  );
}
