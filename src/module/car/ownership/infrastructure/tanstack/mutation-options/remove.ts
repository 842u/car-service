import type { QueryClient } from '@tanstack/react-query';
import { mutationOptions } from '@tanstack/react-query';

import type { OwnershipDto } from '@/car/ownership/application/dto/ownership';
import { ownershipApiClient } from '@/car/ownership/dependency/api-client';
import { queryKeys } from '@/car/ownership/infrastructure/tanstack/query/keys';
import type { RemoveOwnerApiRequest } from '@/car/ownership/interface/api/remove.schema';

type OwnershipRemoveMutationContext = {
  previousOwnerships: OwnershipDto[] | undefined;
};

export const ownershipRemoveMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    throwOnError: false,
    mutationFn: async (contract: RemoveOwnerApiRequest) => {
      const removeResult = await ownershipApiClient.remove(contract);

      if (!removeResult.success) {
        const { message } = removeResult.error;
        throw new Error(message);
      }

      return removeResult.data;
    },
    onMutate: async ({
      carId,
      ownerId,
    }): Promise<OwnershipRemoveMutationContext> => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.ownershipsByCarId(carId),
      });

      const previousOwnerships = queryClient.getQueryData<OwnershipDto[]>(
        queryKeys.ownershipsByCarId(carId),
      );

      queryClient.setQueryData(
        queryKeys.ownershipsByCarId(carId),
        (current: OwnershipDto[] | undefined) =>
          current?.filter((ownership) => ownership.ownerId !== ownerId),
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
