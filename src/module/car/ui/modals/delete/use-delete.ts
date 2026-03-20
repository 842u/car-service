import type { QueryClient } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { deleteCar } from '@/lib/supabase/tables/cars';
import {
  carsInfiniteDeleteOnError,
  carsInfiniteDeleteOnMutate,
} from '@/lib/tanstack/cars';
import { queryKeys } from '@/lib/tanstack/keys';
import type { Car } from '@/types';

export type UseDeleteModalOptions = {
  carId: string;
  onCancel?: () => void;
  onConfirm?: () => void;
};

type MutationVariables = {
  carId: string;
  carName?: string;
  queryClient: QueryClient;
};

export function useDeleteModal({
  carId,
  onCancel,
  onConfirm,
}: UseDeleteModalOptions) {
  const router = useRouter();

  const { addToast } = useToasts();

  const queryClient = useQueryClient();

  const carQueryData = queryClient.getQueryData<Car>(
    queryKeys.carsByCarId(carId),
  );

  const carName = carQueryData?.custom_name;

  const { mutate } = useMutation({
    mutationKey: queryKeys.carsInfinite,
    throwOnError: false,
    mutationFn: ({ carId }: MutationVariables) => deleteCar(carId),
    onMutate: ({ carId, queryClient }) =>
      carsInfiniteDeleteOnMutate(carId, queryClient),
    onSuccess: (_, { carName }) =>
      addToast(`Car ${carName} deleted.`, 'success'),
    onError: (error, { queryClient }, context) => {
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
      { carId, carName, queryClient },
      {
        onSettled: (_, __, { queryClient }) =>
          queryClient.invalidateQueries({
            queryKey: queryKeys.carsInfinite,
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
