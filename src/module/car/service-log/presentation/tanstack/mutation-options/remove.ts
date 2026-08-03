import { mutationOptions } from '@tanstack/react-query';

import type { ServiceLogDto } from '@/car/service-log/application/dto/service-log';
import { serviceLogApiClient } from '@/car/service-log/dependency/api-client';
import { queryKeys } from '@/car/service-log/presentation/tanstack/query/keys';

type RemoveServiceLogMutationVariables = {
  carId: string;
  serviceLogId: string;
};

type ServiceLogRemoveMutationContext = {
  previousServiceLogs: ServiceLogDto[] | undefined;
};

export const serviceLogRemoveMutationOptions = mutationOptions({
  mutationFn: async ({ serviceLogId }: RemoveServiceLogMutationVariables) => {
    const removeResult = await serviceLogApiClient.remove(serviceLogId);

    if (!removeResult.success) {
      const { message } = removeResult.error;
      throw new Error(message);
    }

    return removeResult.data;
  },
  onMutate: async (
    { carId, serviceLogId },
    context,
  ): Promise<ServiceLogRemoveMutationContext> => {
    await context.client.cancelQueries({
      queryKey: queryKeys.byCarId(carId),
    });

    const previousServiceLogs = context.client.getQueryData<ServiceLogDto[]>(
      queryKeys.byCarId(carId),
    );

    context.client.setQueryData(
      queryKeys.byCarId(carId),
      (current: ServiceLogDto[] | undefined) =>
        current?.filter((serviceLog) => serviceLog.id !== serviceLogId),
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
