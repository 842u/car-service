import type { QueryClient } from '@tanstack/react-query';

import type { CarServiceLogFormValues } from '@/car/schemas/zod/carServiceLogFormSchema';
import type { ServiceLogDto } from '@/car/service-log/application/dto/service-log';
import { queryKeys } from '@/car/service-log/infrastructure/tanstack/query/keys';

export async function serviceLogsByCarIdEditOnMutate(
  formData: CarServiceLogFormValues,
  carId: string,
  serviceLogId: string,
  queryClient: QueryClient,
) {
  await queryClient.cancelQueries({
    queryKey: queryKeys.serviceLogsByCarId(carId),
  });

  const previousQueryData = queryClient.getQueryData(
    queryKeys.serviceLogsByCarId(carId),
  ) as ServiceLogDto[] | undefined;

  if (!previousQueryData) return { previousServiceLog: undefined };

  const updatedQueryData = previousQueryData.map((serviceLog) => ({
    ...serviceLog,
  }));

  const updatedServiceLogIndex = updatedQueryData.findIndex(
    (serviceLog) => serviceLog.id === serviceLogId,
  );

  if (updatedServiceLogIndex === -1) return { previousServiceLog: undefined };

  const previousServiceLog = updatedQueryData[updatedServiceLogIndex];

  updatedQueryData[updatedServiceLogIndex] = {
    ...updatedQueryData[updatedServiceLogIndex],
    serviceDate: formData.service_date,
    categories: formData.category,
    mileage: Number.isNaN(formData.mileage) ? null : formData.mileage,
    notes: formData.notes,
    serviceCost: Number.isNaN(formData.service_cost)
      ? null
      : formData.service_cost,
  };

  queryClient.setQueryData(
    queryKeys.serviceLogsByCarId(carId),
    updatedQueryData,
  );

  return { previousServiceLog };
}

export async function serviceLogsByCarIdEditOnError(
  context:
    | Awaited<ReturnType<typeof serviceLogsByCarIdEditOnMutate>>
    | undefined,
  carId: string,
  serviceLogId: string,
  queryClient: QueryClient,
) {
  const previousQueryData = queryClient.getQueryData(
    queryKeys.serviceLogsByCarId(carId),
  ) as ServiceLogDto[] | undefined;

  if (!previousQueryData) return;

  const updatedQueryData = previousQueryData.map((serviceLog) => ({
    ...serviceLog,
  }));

  const updatedServiceLogIndex = updatedQueryData.findIndex(
    (serviceLog) => serviceLog.id === serviceLogId,
  );

  if (updatedServiceLogIndex === -1) return;

  updatedQueryData[updatedServiceLogIndex] = {
    ...updatedQueryData[updatedServiceLogIndex],
    ...context?.previousServiceLog,
  };

  queryClient.setQueryData(
    queryKeys.serviceLogsByCarId(carId),
    updatedQueryData,
  );
}

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
