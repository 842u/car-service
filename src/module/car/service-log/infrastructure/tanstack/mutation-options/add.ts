import type { QueryClient } from '@tanstack/react-query';
import { mutationOptions } from '@tanstack/react-query';

import type { ServiceLogDto } from '@/car/service-log/application/dto/service-log';
import { serviceLogApiClient } from '@/car/service-log/dependency/api-client';
import { queryKeys } from '@/car/service-log/infrastructure/tanstack/query/keys';
import type { AddServiceLogApiRequest } from '@/car/service-log/interface/api/add.schema';

// `authorId` is presentation-only: it never reaches the API contract (the use
// case sets it from the session), but the optimistic entry still needs it to
// render correctly before the server responds.
type AddServiceLogMutationVariables = AddServiceLogApiRequest & {
  authorId: string;
};

type ServiceLogAddMutationContext = {
  previousServiceLogs: ServiceLogDto[] | undefined;
};

export const serviceLogAddMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    throwOnError: false,
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
    onMutate: async ({
      carId,
      authorId,
      serviceDate,
      categories,
      mileage,
      notes,
      serviceCost,
    }): Promise<ServiceLogAddMutationContext> => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.serviceLogsByCarId(carId),
      });

      const previousServiceLogs = queryClient.getQueryData<ServiceLogDto[]>(
        queryKeys.serviceLogsByCarId(carId),
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

      queryClient.setQueryData(
        queryKeys.serviceLogsByCarId(carId),
        (current: ServiceLogDto[] | undefined) =>
          current && [...current, optimisticServiceLog],
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
