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
