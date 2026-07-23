import type { QueryClient } from '@tanstack/react-query';
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
        queryKey: queryKeys.byCarId(carId),
      });

      const previousServiceLogs = queryClient.getQueryData<ServiceLogDto[]>(
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

      queryClient.setQueryData(
        queryKeys.byCarId(carId),
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
        queryKeys.byCarId(carId),
        context.previousServiceLogs,
      );
    },
    onSettled: (_data, _error, { carId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.byCarId(carId) });
      queryClient.invalidateQueries({
        queryKey: queryKeys.all(),
        exact: true,
      });
    },
  });
