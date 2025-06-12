import { QueryClient } from '@tanstack/react-query';

import { CarServiceLogFormValues } from '@/schemas/zod/carServiceLogFormSchema';
import { ServiceLog } from '@/types';

import { queryKeys } from './keys';

export async function serviceLogsByCarIdAddOnMutate(
  formData: CarServiceLogFormValues,
  carId: string,
  queryClient: QueryClient,
) {
  await queryClient.cancelQueries({
    queryKey: queryKeys.serviceLogsByCarId(carId),
  });

  const optimisticServiceLogId = crypto.randomUUID();

  const optimisticCarServiceLog = {
    ...formData,
    mileage: Number.isNaN(formData.mileage) ? null : formData.mileage,
    service_cost: Number.isNaN(formData.service_cost)
      ? null
      : formData.service_cost,
    id: optimisticServiceLogId,
    car_id: carId,
    created_by: 'optimistic update',
    created_at: new Date().toISOString(),
  } satisfies ServiceLog;

  const previousQueryData = queryClient.getQueryData(
    queryKeys.serviceLogsByCarId(carId),
  ) as ServiceLog[] | undefined;

  const updatedQueryData = previousQueryData?.map((serviceLog) => ({
    ...serviceLog,
  }));

  updatedQueryData?.push(optimisticCarServiceLog);

  queryClient.setQueryData(
    queryKeys.serviceLogsByCarId(carId),
    updatedQueryData,
  );

  return { optimisticServiceLogId };
}

export async function serviceLogsByCarIdAddOnError(
  context:
    | Awaited<ReturnType<typeof serviceLogsByCarIdAddOnMutate>>
    | undefined,
  carId: string,
  queryClient: QueryClient,
) {
  const previousQueryData = queryClient.getQueryData(
    queryKeys.serviceLogsByCarId(carId),
  ) as ServiceLog[] | undefined;

  let updatedQueryData = previousQueryData?.map((serviceLog) => ({
    ...serviceLog,
  }));

  updatedQueryData = updatedQueryData?.filter(
    (serviceLog) => serviceLog.id !== context?.optimisticServiceLogId,
  );

  queryClient.setQueryData(
    queryKeys.serviceLogsByCarId(carId),
    updatedQueryData,
  );
}

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
  ) as ServiceLog[] | undefined;

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
    ...formData,
    mileage: Number.isNaN(formData.mileage) ? null : formData.mileage,
    service_cost: Number.isNaN(formData.service_cost)
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
  ) as ServiceLog[] | undefined;

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
  let optimisticDeletedServiceLog: ServiceLog | undefined = undefined;

  const previousQueryData = queryClient.getQueryData(
    queryKeys.serviceLogsByCarId(carId),
  ) as ServiceLog[] | undefined;

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
  ) as ServiceLog[] | undefined;

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
