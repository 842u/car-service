import { mutationOptions } from '@tanstack/react-query';

import { carApiClient } from '@/car/dependency/api-client';
import { CARS_INFINITE_QUERY_PAGE_DATA_LIMIT } from '@/car/infrastructure/data-source/car';
import {
  addCarToInfiniteQueryData,
  type CarsInfiniteQueryData,
  deepCopyCarsInfiniteQueryData,
  deleteCarFromInfiniteQueryData,
  type DeletedCarContext,
} from '@/car/presentation/tanstack/mutation/shared/infinite-query-data';
import { queryKeys } from '@/car/presentation/tanstack/query/keys';

export const carRemoveMutationOptions = mutationOptions({
  mutationKey: queryKeys.infinite(),
  mutationFn: async (carId: string) => {
    const removeResult = await carApiClient.remove(carId);

    if (!removeResult.success) {
      const { message } = removeResult.error;
      throw new Error(message);
    }

    return removeResult.data;
  },
  onMutate: async (carId: string, context) => {
    await context.client.cancelQueries({ queryKey: queryKeys.infinite() });

    let deletedCarContext: DeletedCarContext = {
      deletedCar: null,
      deletedCarPageIndex: null,
      deletedCarPagePositionIndex: null,
    };

    context.client.setQueryData(
      queryKeys.infinite(),
      (data: CarsInfiniteQueryData | undefined) => {
        if (!data) return data;

        const updatedQueryData = deepCopyCarsInfiniteQueryData(data);

        deletedCarContext = deleteCarFromInfiniteQueryData(
          carId,
          updatedQueryData,
        );

        return updatedQueryData;
      },
    );

    return deletedCarContext;
  },
  onError: (_error, _variables, onMutateResult, context) => {
    if (
      !onMutateResult ||
      onMutateResult.deletedCar === null ||
      onMutateResult.deletedCarPageIndex == null ||
      onMutateResult.deletedCarPagePositionIndex == null
    ) {
      return;
    }

    const previousData = context.client.getQueryData<CarsInfiniteQueryData>(
      queryKeys.infinite(),
    );

    if (!previousData) return;

    const updatedQueryData = deepCopyCarsInfiniteQueryData(previousData);

    addCarToInfiniteQueryData(
      onMutateResult.deletedCar,
      updatedQueryData,
      CARS_INFINITE_QUERY_PAGE_DATA_LIMIT,
      onMutateResult.deletedCarPageIndex,
      onMutateResult.deletedCarPagePositionIndex,
    );

    context.client.setQueryData(queryKeys.infinite(), updatedQueryData);
  },
  onSettled: (_data, _error, carId, _onMutateResult, context) => {
    context.client.removeQueries({ queryKey: queryKeys.byId(carId) });
    context.client.invalidateQueries({ queryKey: queryKeys.infinite() });
  },
});
