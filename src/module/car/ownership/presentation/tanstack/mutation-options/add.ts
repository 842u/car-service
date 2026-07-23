import type { QueryClient } from '@tanstack/react-query';
import { mutationOptions } from '@tanstack/react-query';

import type { OwnershipDto } from '@/car/ownership/application/dto/ownership';
import { ownershipApiClient } from '@/car/ownership/dependency/api-client';
import type { AddOwnerApiRequest } from '@/car/ownership/interface/api/add.schema';
import { queryKeys } from '@/car/ownership/presentation/tanstack/query/keys';

type OwnershipAddMutationContext = {
  previousOwnerships: OwnershipDto[] | undefined;
};

export const ownershipAddMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    throwOnError: false,
    mutationFn: async (contract: AddOwnerApiRequest) => {
      const addResult = await ownershipApiClient.add(contract);

      if (!addResult.success) {
        const { message } = addResult.error;
        throw new Error(message);
      }

      return addResult.data;
    },
    onMutate: async ({
      carId,
      ownerId,
    }): Promise<OwnershipAddMutationContext> => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.byCarId(carId),
      });

      const previousOwnerships = queryClient.getQueryData<OwnershipDto[]>(
        queryKeys.byCarId(carId),
      );

      queryClient.setQueryData(
        queryKeys.byCarId(carId),
        (current: OwnershipDto[] | undefined) =>
          current && [
            ...current,
            { carId, ownerId, isPrimary: false, createdAt: null },
          ],
      );

      return { previousOwnerships };
    },
    onError: (_error, { carId }, context) => {
      if (!context) {
        return;
      }

      queryClient.setQueryData(
        queryKeys.byCarId(carId),
        context.previousOwnerships,
      );
    },
    onSettled: (_data, _error, { carId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.byCarId(carId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.ownerProfiles(carId),
      });
    },
  });
