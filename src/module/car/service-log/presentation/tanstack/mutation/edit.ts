import { mutationOptions } from '@tanstack/react-query';

import type { ServiceLogDto } from '@/car/service-log/application/dto/service-log';
import { serviceLogApiClient } from '@/car/service-log/dependency/api-client';
import type { EditServiceLogApiRequest } from '@/car/service-log/interface/api/edit.schema';
import { queryKeys } from '@/car/service-log/presentation/tanstack/query/keys';

// `carId` is presentation-only: it never reaches the API contract (the use
// case derives it server-side from the loaded aggregate), but the optimistic
// update still needs it to target the right cached list.
type EditServiceLogMutationVariables = EditServiceLogApiRequest & {
  carId: string;
};

type ServiceLogEditMutationContext = {
  previousServiceLogs: ServiceLogDto[] | undefined;
};

export const serviceLogEditMutationOptions = mutationOptions({
  mutationFn: async ({
    carId: _carId,
    ...contract
  }: EditServiceLogMutationVariables) => {
    const editResult = await serviceLogApiClient.edit(contract);

    if (!editResult.success) {
      const { message } = editResult.error;
      throw new Error(message);
    }

    return editResult.data;
  },
  onMutate: async (
    {
      carId,
      serviceLogId,
      serviceDate,
      categories,
      mileage,
      notes,
      serviceCost,
    },
    context,
  ): Promise<ServiceLogEditMutationContext> => {
    await context.client.cancelQueries({
      queryKey: queryKeys.byCarId(carId),
    });

    const previousServiceLogs = context.client.getQueryData<ServiceLogDto[]>(
      queryKeys.byCarId(carId),
    );

    context.client.setQueryData(
      queryKeys.byCarId(carId),
      (current: ServiceLogDto[] | undefined) =>
        current?.map((serviceLog) =>
          serviceLog.id === serviceLogId
            ? {
                ...serviceLog,
                serviceDate,
                categories: categories as ServiceLogDto['categories'],
                mileage: mileage ?? null,
                notes: notes ?? null,
                serviceCost: serviceCost ?? null,
              }
            : serviceLog,
        ),
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
