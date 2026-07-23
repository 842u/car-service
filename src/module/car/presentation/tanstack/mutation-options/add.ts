import type { QueryClient } from '@tanstack/react-query';
import { mutationOptions } from '@tanstack/react-query';

import type { CarDto } from '@/car/application/dto/car';
import { carApiClient } from '@/car/dependency/api-client';
import { CARS_INFINITE_QUERY_PAGE_DATA_LIMIT } from '@/car/infrastructure/data-source/car';
import type { AddCarApiRequest } from '@/car/interface/api/add.schema';
import {
  addCarToInfiniteQueryData,
  type CarsInfiniteQueryData,
  deepCopyCarsInfiniteQueryData,
  patchCarInInfiniteQueryData,
} from '@/car/presentation/tanstack/mutation-options/shared/infinite-query-data';
import { queryKeys } from '@/car/presentation/tanstack/query/keys';

export type CarAddMutationVariables = AddCarApiRequest & {
  image?: File | null;
};

export const carAddMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationKey: queryKeys.infinite(),
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
      await queryClient.cancelQueries({ queryKey: queryKeys.infinite() });

      const previousData = queryClient.getQueryData<CarsInfiniteQueryData>(
        queryKeys.infinite(),
      );

      const { image, ...contract } = variables;

      const newCar = {
        ...contract,
        id: crypto.randomUUID(),
        imageUrl: image ? URL.createObjectURL(image) : null,
      } as CarDto;

      queryClient.setQueryData(
        queryKeys.infinite(),
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

      return {
        previousData,
        optimisticImageUrl: newCar.imageUrl,
        optimisticCarId: newCar.id,
      };
    },
    onError: (_error, _variables, context) => {
      if (!context) return;

      // `setQueryData` treats an `undefined` value as a no-op, so a previously
      // empty cache is restored by removing the query rather than "setting" it
      // back to undefined.
      if (context.previousData === undefined) {
        queryClient.removeQueries({ queryKey: queryKeys.infinite() });
        return;
      }

      queryClient.setQueryData(queryKeys.infinite(), context.previousData);
    },
    onSuccess: (data, _variables, context) => {
      if (!context) return;

      // The optimistic entry was inserted under a client-generated id, so a
      // caller chaining a follow-up mutation off the real id (e.g. attaching
      // an image right after add) needs that id to already be in the cache.
      // Reconcile it here instead of waiting for the next invalidated refetch.
      queryClient.setQueryData(
        queryKeys.infinite(),
        (current: CarsInfiniteQueryData | undefined) => {
          if (!current) return current;

          const updatedQueryData = deepCopyCarsInfiniteQueryData(current);

          patchCarInInfiniteQueryData(
            context.optimisticCarId,
            { ...data, imageUrl: context.optimisticImageUrl ?? data.imageUrl },
            updatedQueryData,
          );

          return updatedQueryData;
        },
      );
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.optimisticImageUrl) {
        URL.revokeObjectURL(context.optimisticImageUrl);
      }
    },
  });
