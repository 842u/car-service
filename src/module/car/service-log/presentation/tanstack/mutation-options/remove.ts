import type { QueryClient } from '@tanstack/react-query';
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

export const serviceLogRemoveMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: async ({ serviceLogId }: RemoveServiceLogMutationVariables) => {
      const removeResult = await serviceLogApiClient.remove(serviceLogId);

      if (!removeResult.success) {
        const { message } = removeResult.error;
        throw new Error(message);
      }

      return removeResult.data;
    },
    onMutate: async ({
      carId,
      serviceLogId,
    }): Promise<ServiceLogRemoveMutationContext> => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.byCarId(carId),
      });

      const previousServiceLogs = queryClient.getQueryData<ServiceLogDto[]>(
        queryKeys.byCarId(carId),
      );

      queryClient.setQueryData(
        queryKeys.byCarId(carId),
        (current: ServiceLogDto[] | undefined) =>
          current?.filter((serviceLog) => serviceLog.id !== serviceLogId),
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
