import type { QueryClient } from '@tanstack/react-query';
import { mutationOptions } from '@tanstack/react-query';

import type { OwnershipDto } from '@/car/ownership/application/dto/ownership';
import { ownershipApiClient } from '@/car/ownership/dependency/api-client';
import type { PromotePrimaryOwnerApiRequest } from '@/car/ownership/interface/api/promote.schema';
import { queryKeys } from '@/car/ownership/presentation/tanstack/query/keys';

type OwnershipPromoteMutationContext = {
  previousOwnerships: OwnershipDto[] | undefined;
};

export const ownershipPromoteMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: async (contract: PromotePrimaryOwnerApiRequest) => {
      const promoteResult = await ownershipApiClient.promote(contract);

      if (!promoteResult.success) {
        const { message } = promoteResult.error;
        throw new Error(message);
      }

      return promoteResult.data;
    },
    onMutate: async ({
      carId,
      ownerId,
    }): Promise<OwnershipPromoteMutationContext> => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.byCarId(carId),
      });

      const previousOwnerships = queryClient.getQueryData<OwnershipDto[]>(
        queryKeys.byCarId(carId),
      );

      queryClient.setQueryData(
        queryKeys.byCarId(carId),
        (current: OwnershipDto[] | undefined) =>
          current?.map((ownership) => ({
            ...ownership,
            isPrimary: ownership.ownerId === ownerId,
          })),
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
    },
  });
