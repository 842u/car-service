import type { QueryClient } from '@tanstack/react-query';
import { mutationOptions } from '@tanstack/react-query';

import type { ServiceLogDto } from '@/car/service-log/application/dto/service-log';
import { serviceLogApiClient } from '@/car/service-log/dependency/api-client';
import { queryKeys } from '@/car/service-log/infrastructure/tanstack/query/keys';
import type { EditServiceLogApiRequest } from '@/car/service-log/interface/api/edit.schema';

// `carId` is presentation-only: it never reaches the API contract (the use
// case derives it server-side from the loaded aggregate), but the optimistic
// update still needs it to target the right cached list.
type EditServiceLogMutationVariables = EditServiceLogApiRequest & {
  carId: string;
};

type ServiceLogEditMutationContext = {
  previousServiceLogs: ServiceLogDto[] | undefined;
};

export const serviceLogEditMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    throwOnError: false,
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
    onMutate: async ({
      carId,
      serviceLogId,
      serviceDate,
      categories,
      mileage,
      notes,
      serviceCost,
    }): Promise<ServiceLogEditMutationContext> => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.serviceLogsByCarId(carId),
      });

      const previousServiceLogs = queryClient.getQueryData<ServiceLogDto[]>(
        queryKeys.serviceLogsByCarId(carId),
      );

      queryClient.setQueryData(
        queryKeys.serviceLogsByCarId(carId),
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
    onError: (_error, { carId }, context) => {
      if (!context) {
        return;
      }

      queryClient.setQueryData(
        queryKeys.serviceLogsByCarId(carId),
        context.previousServiceLogs,
      );
    },
    onSettled: (_data, _error, { carId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.serviceLogsByCarId(carId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceLogs });
    },
  });
