import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Route } from 'next';

import {
  ServiceLogPostRouteHandlerRequest,
  ServiceLogRouteHandlerResponse,
} from '@/app/api/service-log/route';
import { CarServiceLogFormValues } from '@/schemas/zod/carServiceLogFormSchema';
import { RouteHandlerResponse, ServiceLog } from '@/types';
import { queryKeys } from '@/utils/tanstack/keys';

import { FormProps } from '../../shared/base/Form/Form';
import { CarServiceLogForm } from '../../shared/CarServiceLogForm/CarServiceLogForm';

type CarServiceLogAddFormProps = Omit<FormProps, 'onSubmit'> & {
  carId: string;
  onSubmit?: () => void;
};

async function submitCarServiceLogAddFormData(
  carId: string,
  formData: CarServiceLogFormValues,
) {
  const jsonRequestData = JSON.stringify({
    formData,
    car_id: carId,
  } satisfies ServiceLogPostRouteHandlerRequest);

  const url = new URL(window.location.origin);
  url.pathname = '/api/service-log' satisfies Route;

  try {
    const apiResponse = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: jsonRequestData,
    });

    const { error } =
      (await apiResponse.json()) as RouteHandlerResponse<ServiceLogRouteHandlerResponse>;

    if (!apiResponse.ok || error) {
      throw new Error(
        error?.message || `Request failed with status ${apiResponse.status}.`,
      );
    }
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('Unknown error occurred.');
  }
}

export function CarServiceLogAddForm({
  carId,
  onSubmit,
  ...props
}: CarServiceLogAddFormProps) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    throwOnError: false,
    mutationFn: (formData: CarServiceLogFormValues) =>
      submitCarServiceLogAddFormData(carId, formData),
    onMutate: async (formData: CarServiceLogFormValues) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.serviceLogsByCarId(carId),
      });

      const newCarServiceLog = {
        ...formData,
        car_id: carId,
        created_at: new Date().toISOString(),
        created_by: 'optimistic update',
        id: crypto.randomUUID(),
      } satisfies ServiceLog;

      const currentQueryData = queryClient.getQueryData(
        queryKeys.serviceLogsByCarId(carId),
      ) as ServiceLog[] | undefined;

      const updatedQueryData = currentQueryData?.map((serviceLog) => ({
        ...serviceLog,
      }));

      updatedQueryData?.push(newCarServiceLog);

      queryClient.setQueryData(
        queryKeys.serviceLogsByCarId(carId),
        updatedQueryData,
      );
    },
  });

  const handleFormSubmit = async (formData: CarServiceLogFormValues) => {
    mutate(formData, {
      onSettled: () =>
        queryClient.invalidateQueries({
          queryKey: queryKeys.serviceLogsByCarId(carId),
        }),
    });
    onSubmit && onSubmit();
  };

  return <CarServiceLogForm onSubmit={handleFormSubmit} {...props} />;
}
