import type { QueryClient } from '@tanstack/react-query';
import { mutationOptions } from '@tanstack/react-query';

import type { CarDto } from '@/car/application/dto/car';
import { carApiClient } from '@/car/dependency/api-client';
import { CARS_INFINITE_QUERY_PAGE_DATA_LIMIT } from '@/car/infrastructure/data-source/car';
import {
  addCarToInfiniteQueryData,
  type CarsInfiniteQueryData,
  deepCopyCarsInfiniteQueryData,
} from '@/car/infrastructure/tanstack/mutation-options/shared/infinite-query-data';
import { queryKeys } from '@/car/infrastructure/tanstack/query/keys';
import type { AddCarApiRequest } from '@/car/interface/api/add.schema';

export type CarAddMutationVariables = AddCarApiRequest & {
  image?: File | null;
};

export const carAddMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    throwOnError: false,
    mutationFn: async (variables: CarAddMutationVariables) => {
      const { image, ...contract } = variables;

      const addResult = await carApiClient.add(contract);

      if (!addResult.success) {
        const { message } = addResult.error;
        throw new Error(message);
      }

      return addResult.data;
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.carsInfinite });

      const { image, ...contract } = variables;

      const newCar = {
        ...contract,
        id: crypto.randomUUID(),
        imageUrl: image ? URL.createObjectURL(image) : null,
      } as CarDto;

      queryClient.setQueryData(
        queryKeys.carsInfinite,
        (data: CarsInfiniteQueryData | undefined) => {
          const updatedQueryData = deepCopyCarsInfiniteQueryData(data);

          addCarToInfiniteQueryData(
            newCar,
            updatedQueryData,
            CARS_INFINITE_QUERY_PAGE_DATA_LIMIT,
          );

          return updatedQueryData;
        },
      );

      return { newCarId: newCar.id };
    },
  });
