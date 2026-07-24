import { mutationOptions } from '@tanstack/react-query';

import type { CarDto } from '@/car/application/dto/car';
import { carApiClient } from '@/car/dependency/api-client';
import type { EditCarApiRequest } from '@/car/interface/api/edit.schema';
import {
  type CarsInfiniteQueryData,
  deepCopyCarsInfiniteQueryData,
  patchCarInInfiniteQueryData,
} from '@/car/presentation/tanstack/mutation-options/shared/infinite-query-data';
import { queryKeys } from '@/car/presentation/tanstack/query/keys';
import { browserStorageClient } from '@/dependency/storage-client/browser';
import { hashFile } from '@/lib/utils';

export type CarEditMutationVariables = EditCarApiRequest & {
  image?: File | null;
};

export const carEditMutationOptions = mutationOptions({
  mutationKey: queryKeys.infinite(),
  mutationFn: async (variables: CarEditMutationVariables) => {
    const { image, ...contract } = variables;

    if (image) {
      const hashedFile = await hashFile(image);
      const uploadPath = `${contract.carId}/${hashedFile}`;

      const uploadResult = await browserStorageClient.upload(
        'cars_images',
        uploadPath,
        image,
      );

      if (!uploadResult.success) {
        const { message } = uploadResult.error;
        throw new Error(`The image failed to upload: ${message}`);
      }

      const apiUrl =
        process.env.NEXT_PUBLIC_SUPABASE_URL! + '/storage/v1/object/public/';

      contract.imageUrl = apiUrl + uploadResult.data.fullPath;
    }

    const editResult = await carApiClient.edit(contract);

    if (!editResult.success) {
      const { message } = editResult.error;
      throw new Error(message);
    }

    return editResult.data;
  },
  onMutate: async (variables, context) => {
    const { carId, image, ...contract } = variables;

    await context.client.cancelQueries({
      queryKey: queryKeys.byId(carId),
    });
    await context.client.cancelQueries({ queryKey: queryKeys.infinite() });

    const previousCar = context.client.getQueryData<CarDto>(
      queryKeys.byId(carId),
    );

    const optimisticImageUrl = image ? URL.createObjectURL(image) : undefined;

    const patch = {
      ...contract,
      ...(optimisticImageUrl ? { imageUrl: optimisticImageUrl } : {}),
    } as Partial<CarDto>;

    context.client.setQueryData(
      queryKeys.byId(carId),
      (current: CarDto | undefined) => current && { ...current, ...patch },
    );

    const previousCarsInfiniteData = context.client.getQueryData<
      CarsInfiniteQueryData | undefined
    >(queryKeys.infinite());

    context.client.setQueryData(
      queryKeys.infinite(),
      (data: CarsInfiniteQueryData | undefined) => {
        if (!data) return data;

        const updatedQueryData = deepCopyCarsInfiniteQueryData(data);

        patchCarInInfiniteQueryData(carId, patch, updatedQueryData);

        return updatedQueryData;
      },
    );

    return { previousCar, previousCarsInfiniteData, optimisticImageUrl };
  },
  onError: (_error, variables, onMutateResult, context) => {
    if (!onMutateResult) return;

    context.client.setQueryData(
      queryKeys.byId(variables.carId),
      onMutateResult.previousCar,
    );
    context.client.setQueryData(
      queryKeys.infinite(),
      onMutateResult.previousCarsInfiniteData,
    );
  },
  onSettled: (_data, _error, variables, onMutateResult, context) => {
    if (onMutateResult?.optimisticImageUrl) {
      URL.revokeObjectURL(onMutateResult.optimisticImageUrl);
    }

    context.client.invalidateQueries({
      queryKey: queryKeys.byId(variables.carId),
    });
    context.client.invalidateQueries({ queryKey: queryKeys.infinite() });
  },
});
