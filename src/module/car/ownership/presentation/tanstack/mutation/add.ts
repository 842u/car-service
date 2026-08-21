import { mutationOptions } from '@tanstack/react-query';

import type { OwnershipDto } from '@/car/ownership/application/dto/ownership';
import { ownershipApiClient } from '@/car/ownership/dependency/api-client';
import type { AddOwnerApiRequest } from '@/car/ownership/interface/api/add.schema';
import { queryKeys } from '@/car/ownership/presentation/tanstack/query/keys';

type OwnershipAddMutationContext = {
  previousOwnerships: OwnershipDto[] | undefined;
};

export const ownershipAddMutationOptions = mutationOptions({
  mutationFn: async (contract: AddOwnerApiRequest) => {
    const addResult = await ownershipApiClient.add(contract);

    if (!addResult.success) {
      const { message } = addResult.error;
      throw new Error(message);
    }

    return addResult.data;
  },
  onMutate: async (
    { carId, ownerId },
    context,
  ): Promise<OwnershipAddMutationContext> => {
    await context.client.cancelQueries({
      queryKey: queryKeys.byCarId(carId),
    });

    const previousOwnerships = context.client.getQueryData<OwnershipDto[]>(
      queryKeys.byCarId(carId),
    );

    //! The table sorts on `createdAt`, so `null` would park the new row at the
    //! bottom and let the refetch visibly jump it to the top. Postgres stores
    //! the column zone-less, hence trimming the `Z`: the optimistic value has
    //! to sort against server rows under the same string shape.
    const createdAt = new Date().toISOString().slice(0, -1);

    context.client.setQueryData(
      queryKeys.byCarId(carId),
      (current: OwnershipDto[] | undefined) =>
        current && [
          ...current,
          { carId, ownerId, isPrimary: false, createdAt },
        ],
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
