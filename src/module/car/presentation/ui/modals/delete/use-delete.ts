import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';

import type { CarDto } from '@/car/application/dto/car';
import { CARS_INFINITE_QUERY_PAGE_DATA_LIMIT } from '@/car/infrastructure/data-source/car';
import { carRemoveMutationOptions } from '@/car/presentation/tanstack/mutation-options/remove';
import {
  addCarToInfiniteQueryData,
  type CarsInfiniteQueryData,
  deepCopyCarsInfiniteQueryData,
} from '@/car/presentation/tanstack/mutation-options/shared/infinite-query-data';
import { queryKeys } from '@/car/presentation/tanstack/query/keys';
import { useToasts } from '@/common/presentation/hook/use-toasts';

export type UseDeleteModalOptions = {
  carId: string;
  onCancel?: () => void;
  onConfirm?: () => void;
};

export function useDeleteModal({
  carId,
  onCancel,
  onConfirm,
}: UseDeleteModalOptions) {
  const router = useRouter();

  const { addToast } = useToasts();

  const queryClient = useQueryClient();

  const carQueryData = queryClient.getQueryData<CarDto>(queryKeys.byId(carId));

  const carName = carQueryData?.customName;

  const { mutate } = useMutation({
    ...carRemoveMutationOptions(queryClient),
    mutationKey: queryKeys.infinite(),
    onSuccess: () => addToast(`Car ${carName} deleted.`, 'success'),
    onError: (error, _, context) => {
      addToast(error.message, 'error');

      if (
        !context ||
        context.deletedCar === null ||
        context.deletedCarPageIndex == null ||
        context.deletedCarPagePositionIndex == null
      ) {
        return;
      }

      const previousData = queryClient.getQueryData<CarsInfiniteQueryData>(
        queryKeys.infinite(),
      );

      if (!previousData) return;

      const updatedQueryData = deepCopyCarsInfiniteQueryData(previousData);

      addCarToInfiniteQueryData(
        context.deletedCar,
        updatedQueryData,
        CARS_INFINITE_QUERY_PAGE_DATA_LIMIT,
        context.deletedCarPageIndex,
        context.deletedCarPagePositionIndex,
      );

      queryClient.setQueryData(queryKeys.infinite(), updatedQueryData);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.infinite() }),
  });

  const handleCancelButtonClick = () => {
    onCancel && onCancel();
  };

  const handleDeleteButtonClick = () => {
    onConfirm && onConfirm();

    mutate(carId);

    router.replace('/dashboard/cars' satisfies Route);
  };

  return {
    handlers: {
      handleCancelButtonClick,
      handleDeleteButtonClick,
    },
  };
}
