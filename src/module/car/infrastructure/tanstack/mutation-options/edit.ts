import type { QueryClient } from '@tanstack/react-query';
import { mutationOptions } from '@tanstack/react-query';

import type { CarDto } from '@/car/application/dto/car';
import { carApiClient } from '@/car/dependency/api-client';
import {
  type CarsInfiniteQueryData,
  deepCopyCarsInfiniteQueryData,
  patchCarInInfiniteQueryData,
} from '@/car/infrastructure/tanstack/mutation-options/shared/infinite-query-data';
import { queryKeys } from '@/car/infrastructure/tanstack/query/keys';
import type { EditCarApiRequest } from '@/car/interface/api/edit.schema';

export type CarEditMutationVariables = EditCarApiRequest & {
  image?: File | null;
};

export const carEditMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    throwOnError: false,
    mutationFn: async (variables: CarEditMutationVariables) => {
      const { image, ...contract } = variables;

      const editResult = await carApiClient.edit(contract);

      if (!editResult.success) {
        const { message } = editResult.error;
        throw new Error(message);
      }

      return editResult.data;
    },
    onMutate: async (variables) => {
      const { carId, image, ...contract } = variables;

      await queryClient.cancelQueries({
        queryKey: queryKeys.carsByCarId(carId),
      });
      await queryClient.cancelQueries({ queryKey: queryKeys.carsInfinite });

      const previousCar = queryClient.getQueryData<CarDto>(
        queryKeys.carsByCarId(carId),
      );

      const patch = {
        ...contract,
        ...(image ? { imageUrl: URL.createObjectURL(image) } : {}),
      } as Partial<CarDto>;

      queryClient.setQueryData(
        queryKeys.carsByCarId(carId),
        (current: CarDto | undefined) => current && { ...current, ...patch },
      );

      const previousCarsInfiniteData = queryClient.getQueryData<
        CarsInfiniteQueryData | undefined
      >(queryKeys.carsInfinite);

      queryClient.setQueryData(
        queryKeys.carsInfinite,
        (data: CarsInfiniteQueryData | undefined) => {
          if (!data) return data;

          const updatedQueryData = deepCopyCarsInfiniteQueryData(data);

          patchCarInInfiniteQueryData(carId, patch, updatedQueryData);

          return updatedQueryData;
        },
      );

      return { previousCar, previousCarsInfiniteData };
    },
  });
