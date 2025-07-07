import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Route } from 'next';
import { useRouter } from 'next/navigation';

import { useToasts } from '@/hooks/useToasts';
import { Car } from '@/types';
import { deleteCar } from '@/utils/supabase/tables/cars';
import {
  carsInfiniteDeleteOnError,
  carsInfiniteDeleteOnMutate,
} from '@/utils/tanstack/cars';
import { queryKeys } from '@/utils/tanstack/keys';

export type UseCarDeleteModalOptions = {
  carId: string;
  onCancel?: () => void;
  onConfirm?: () => void;
};

export function useCarDeleteModal({
  carId,
  onCancel,
  onConfirm,
}: UseCarDeleteModalOptions) {
  const router = useRouter();

  const { addToast } = useToasts();

  const queryClient = useQueryClient();

  const carQueryData = queryClient.getQueryData<Car>(
    queryKeys.carsByCarId(carId),
  );

  const carName = carQueryData?.custom_name;

  const { mutate } = useMutation({
    mutationKey: queryKeys.infiniteCars,
    throwOnError: false,
    mutationFn: ({ carId }: { carId: string; carName?: string }) =>
      deleteCar(carId),
    onMutate: ({ carId }) => carsInfiniteDeleteOnMutate(carId, queryClient),
    onSuccess: (_, { carName }) =>
      addToast(`Successfully deleted ${carName} car.`, 'success'),
    onError: (error, _, context) => {
      addToast(error.message, 'error');
      carsInfiniteDeleteOnError(queryClient, context);
    },
  });

  const handleCancelButtonClick = () => {
    onCancel && onCancel();
  };

  const handleDeleteButtonClick = () => {
    onConfirm && onConfirm();

    mutate(
      { carId, carName },
      {
        onSettled: () =>
          queryClient.invalidateQueries({
            queryKey: queryKeys.infiniteCars,
          }),
      },
    );

    router.replace('/dashboard/cars' satisfies Route);
  };

  return {
    handlers: {
      handleCancelButtonClick,
      handleDeleteButtonClick,
    },
  };
}
