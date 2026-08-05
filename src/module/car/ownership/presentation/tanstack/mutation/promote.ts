import { mutationOptions } from '@tanstack/react-query';

import type { OwnershipDto } from '@/car/ownership/application/dto/ownership';
import { ownershipApiClient } from '@/car/ownership/dependency/api-client';
import type { PromotePrimaryOwnerApiRequest } from '@/car/ownership/interface/api/promote.schema';
import { queryKeys } from '@/car/ownership/presentation/tanstack/query/keys';

type OwnershipPromoteMutationContext = {
  previousOwnerships: OwnershipDto[] | undefined;
};

export const ownershipPromoteMutationOptions = mutationOptions({
  mutationFn: async (contract: PromotePrimaryOwnerApiRequest) => {
    const promoteResult = await ownershipApiClient.promote(contract);

    if (!promoteResult.success) {
      const { message } = promoteResult.error;
      throw new Error(message);
    }

    return promoteResult.data;
  },
  onMutate: async (
    { carId, ownerId },
    context,
  ): Promise<OwnershipPromoteMutationContext> => {
    await context.client.cancelQueries({
      queryKey: queryKeys.byCarId(carId),
    });

    const previousOwnerships = context.client.getQueryData<OwnershipDto[]>(
      queryKeys.byCarId(carId),
    );

    context.client.setQueryData(
      queryKeys.byCarId(carId),
      (current: OwnershipDto[] | undefined) =>
        current?.map((ownership) => ({
          ...ownership,
          isPrimary: ownership.ownerId === ownerId,
        })),
    );

    return { previousOwnerships };
  },
  onError: (_error, { carId }, onMutateResult, context) => {
    if (!onMutateResult) {
      return;
    }

    context.client.setQueryData(
      queryKeys.byCarId(carId),
      onMutateResult.previousOwnerships,
    );
  },
  onSettled: (_data, _error, { carId }, _onMutateResult, context) => {
    context.client.invalidateQueries({
      queryKey: queryKeys.byCarId(carId),
    });
  },
});
