import type { QueryClient } from '@tanstack/react-query';
import { mutationOptions } from '@tanstack/react-query';

import type { OwnershipDto } from '@/car/ownership/application/dto/ownership';
import { ownershipApiClient } from '@/car/ownership/dependency/api-client';
import { queryKeys } from '@/car/ownership/infrastructure/tanstack/query/keys';
import type { AddOwnerApiRequest } from '@/car/ownership/interface/api/add.schema';

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
        queryKey: queryKeys.ownershipsByCarId(carId),
      });

      const previousOwnerships = queryClient.getQueryData<OwnershipDto[]>(
        queryKeys.ownershipsByCarId(carId),
      );

      queryClient.setQueryData(
        queryKeys.ownershipsByCarId(carId),
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
        queryKeys.ownershipsByCarId(carId),
        context.previousOwnerships,
      );
    },
    onSettled: (_data, _error, { carId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.ownershipsByCarId(carId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.ownerProfilesByCarIdPrefix(carId),
      });
    },
  });
