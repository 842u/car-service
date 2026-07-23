import type { QueryClient } from '@tanstack/react-query';
import { mutationOptions } from '@tanstack/react-query';

import { carApiClient } from '@/car/dependency/api-client';
import { CARS_INFINITE_QUERY_PAGE_DATA_LIMIT } from '@/car/infrastructure/data-source/car';
import {
  addCarToInfiniteQueryData,
  type CarsInfiniteQueryData,
  deepCopyCarsInfiniteQueryData,
  deleteCarFromInfiniteQueryData,
  type DeletedCarContext,
} from '@/car/presentation/tanstack/mutation-options/shared/infinite-query-data';
import { queryKeys } from '@/car/presentation/tanstack/query/keys';

export const carRemoveMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    throwOnError: false,
    mutationKey: queryKeys.infinite(),
    mutationFn: async (carId: string) => {
      const removeResult = await carApiClient.remove(carId);

      if (!removeResult.success) {
        const { message } = removeResult.error;
        throw new Error(message);
      }

      return removeResult.data;
    },
    onMutate: async (carId: string) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.infinite() });

      let deletedCarContext: DeletedCarContext = {
        deletedCar: null,
        deletedCarPageIndex: null,
        deletedCarPagePositionIndex: null,
      };

      queryClient.setQueryData(
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
    onError: (_error, _variables, context) => {
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
  });
