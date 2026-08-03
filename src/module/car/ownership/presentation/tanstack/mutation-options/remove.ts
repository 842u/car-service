import { mutationOptions } from '@tanstack/react-query';

import type { OwnershipDto } from '@/car/ownership/application/dto/ownership';
import { ownershipApiClient } from '@/car/ownership/dependency/api-client';
import type { RemoveOwnerApiRequest } from '@/car/ownership/interface/api/remove.schema';
import { queryKeys } from '@/car/ownership/presentation/tanstack/query/keys';

type OwnershipRemoveMutationContext = {
  previousOwnerships: OwnershipDto[] | undefined;
};

export const ownershipRemoveMutationOptions = mutationOptions({
  mutationFn: async (contract: RemoveOwnerApiRequest) => {
    const removeResult = await ownershipApiClient.remove(contract);

    if (!removeResult.success) {
      const { message } = removeResult.error;
      throw new Error(message);
    }

    return removeResult.data;
  },
  onMutate: async (
    { carId, ownerId },
    context,
  ): Promise<OwnershipRemoveMutationContext> => {
    await context.client.cancelQueries({
      queryKey: queryKeys.byCarId(carId),
    });

    const previousOwnerships = context.client.getQueryData<OwnershipDto[]>(
      queryKeys.byCarId(carId),
    );

    context.client.setQueryData(
      queryKeys.byCarId(carId),
      (current: OwnershipDto[] | undefined) =>
        current?.filter((ownership) => ownership.ownerId !== ownerId),
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
