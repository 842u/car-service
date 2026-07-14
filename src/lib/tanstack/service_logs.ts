import type { QueryClient } from '@tanstack/react-query';

import type { ServiceLogDto } from '@/car/service-log/application/dto/service-log';
import { queryKeys } from '@/car/service-log/infrastructure/tanstack/query/keys';

export async function serviceLogsByCarIdDeleteOnMutate(
  carId: string,
  serviceLogId: string,
  queryClient: QueryClient,
) {
  let optimisticDeletedServiceLog: ServiceLogDto | undefined = undefined;

  const previousQueryData = queryClient.getQueryData(
    queryKeys.serviceLogsByCarId(carId),
  ) as ServiceLogDto[] | undefined;

  if (!previousQueryData) return { optimisticDeletedServiceLog };

  optimisticDeletedServiceLog = previousQueryData.find(
    (serviceLog) => serviceLog.id === serviceLogId,
  );

  if (!optimisticDeletedServiceLog) return { optimisticDeletedServiceLog };

  let updatedQueryData = previousQueryData.map((serviceLog) => ({
    ...serviceLog,
  }));

  updatedQueryData = updatedQueryData.filter(
    (serviceLog) => serviceLog.id !== serviceLogId,
  );

  queryClient.setQueryData(
    queryKeys.serviceLogsByCarId(carId),
    updatedQueryData,
  );

  return { optimisticDeletedServiceLog };
}

export async function serviceLogsByCarIdDeleteOnError(
  context:
    | Awaited<ReturnType<typeof serviceLogsByCarIdDeleteOnMutate>>
    | undefined,
  carId: string,
  queryClient: QueryClient,
) {
  const previousQueryData = queryClient.getQueryData(
    queryKeys.serviceLogsByCarId(carId),
  ) as ServiceLogDto[] | undefined;

  if (!previousQueryData || !context?.optimisticDeletedServiceLog) return;

  const updatedQueryData = previousQueryData.map((serviceLog) => ({
    ...serviceLog,
  }));

  updatedQueryData.push(context.optimisticDeletedServiceLog);

  queryClient.setQueryData(
    queryKeys.serviceLogsByCarId(carId),
    updatedQueryData,
  );
}
