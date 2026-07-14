import { queryOptions } from '@tanstack/react-query';

import { serviceLogDataSource } from '@/car/service-log/dependency/data-source';
import { queryKeys } from '@/car/service-log/infrastructure/tanstack/query/keys';

export const getServiceLogsByCarIdQueryOptions = (carId: string) =>
  queryOptions({
    throwOnError: false,
    queryKey: queryKeys.serviceLogsByCarId(carId),
    queryFn: async () => {
      const serviceLogsResult = await serviceLogDataSource.getByCarId(carId);

      if (!serviceLogsResult.success) {
        const { message } = serviceLogsResult.error;
        throw new Error(message);
      }

      return serviceLogsResult.data;
    },
  });

export const getServiceLogsQueryOptions = () =>
  queryOptions({
    throwOnError: false,
    queryKey: queryKeys.serviceLogs,
    queryFn: async () => {
      const serviceLogsResult = await serviceLogDataSource.getAll();

      if (!serviceLogsResult.success) {
        const { message } = serviceLogsResult.error;
        throw new Error(message);
      }

      return serviceLogsResult.data;
    },
  });
