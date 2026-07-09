import type { QueryClient } from '@tanstack/react-query';
import { mutationOptions } from '@tanstack/react-query';

import { carApiClient } from '@/car/dependency/api-client';
import {
  type CarsInfiniteQueryData,
  deepCopyCarsInfiniteQueryData,
  deleteCarFromInfiniteQueryData,
  type DeletedCarContext,
} from '@/car/infrastructure/tanstack/mutation-options/shared/infinite-query-data';
import { queryKeys } from '@/car/infrastructure/tanstack/query/keys';

export const carRemoveMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    throwOnError: false,
    mutationFn: async (carId: string) => {
      const removeResult = await carApiClient.remove(carId);

      if (!removeResult.success) {
        const { message } = removeResult.error;
        throw new Error(message);
      }

      return removeResult.data;
    },
    onMutate: async (carId: string) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.carsInfinite });

      let deletedCarContext: DeletedCarContext = {
        deletedCar: null,
        deletedCarPageIndex: null,
        deletedCarPagePositionIndex: null,
      };

      queryClient.setQueryData(
        queryKeys.carsInfinite,
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
  });
