import { mutationOptions } from '@tanstack/react-query';

import type { ServiceLogDto } from '@/car/service-log/application/dto/service-log';
import { serviceLogApiClient } from '@/car/service-log/dependency/api-client';
import type { AddServiceLogApiRequest } from '@/car/service-log/interface/api/add.schema';
import { queryKeys } from '@/car/service-log/presentation/tanstack/query/keys';

// `authorId` is presentation-only: it never reaches the API contract (the use
// case sets it from the session), but the optimistic entry still needs it to
// render correctly before the server responds.
type AddServiceLogMutationVariables = AddServiceLogApiRequest & {
  authorId: string;
};

type ServiceLogAddMutationContext = {
  previousServiceLogs: ServiceLogDto[] | undefined;
};

export const serviceLogAddMutationOptions = mutationOptions({
  mutationFn: async ({
    authorId: _authorId,
    ...contract
  }: AddServiceLogMutationVariables) => {
    const addResult = await serviceLogApiClient.add(contract);

    if (!addResult.success) {
      const { message } = addResult.error;
      throw new Error(message);
    }

    return addResult.data;
  },
  onMutate: async (
    { carId, authorId, serviceDate, categories, mileage, notes, serviceCost },
    context,
  ): Promise<ServiceLogAddMutationContext> => {
    await context.client.cancelQueries({
      queryKey: queryKeys.byCarId(carId),
    });

    const previousServiceLogs = context.client.getQueryData<ServiceLogDto[]>(
      queryKeys.byCarId(carId),
    );

    const optimisticServiceLog = {
      id: crypto.randomUUID(),
      carId,
      authorId,
      serviceDate,
      categories: categories as ServiceLogDto['categories'],
      mileage: mileage ?? null,
      notes: notes ?? null,
      serviceCost: serviceCost ?? null,
      createdAt: null,
    } satisfies ServiceLogDto;

    context.client.setQueryData(
      queryKeys.byCarId(carId),
      (current: ServiceLogDto[] | undefined) =>
        current && [...current, optimisticServiceLog],
    );

    return { previousServiceLogs };
  },
  onError: (_error, { carId }, onMutateResult, context) => {
    if (!onMutateResult) {
      return;
    }

    context.client.setQueryData(
      queryKeys.byCarId(carId),
      onMutateResult.previousServiceLogs,
    );
  },
  onSettled: (_data, _error, { carId }, _onMutateResult, context) => {
    context.client.invalidateQueries({ queryKey: queryKeys.byCarId(carId) });
    context.client.invalidateQueries({
      queryKey: queryKeys.all(),
      exact: true,
    });
  },
});
