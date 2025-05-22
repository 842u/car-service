import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Route } from 'next';

import {
  ServiceLogPostRouteHandlerRequest,
  ServiceLogRouteHandlerResponse,
} from '@/app/api/service-log/route';
import { useToasts } from '@/hooks/useToasts';
import { CarServiceLogFormValues } from '@/schemas/zod/carServiceLogFormSchema';
import { RouteHandlerResponse } from '@/types';
import { queryKeys } from '@/utils/tanstack/keys';
import {
  serviceLogsByCarIdAddOnError,
  serviceLogsByCarIdAddOnMutate,
} from '@/utils/tanstack/service_logs';

import { CarServiceLogAddFormProps } from './CarServiceLogAddForm';

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

export function useCarServiceLogAddForm({
  carId,
  onSubmit,
}: Pick<CarServiceLogAddFormProps, 'carId' | 'onSubmit'>) {
  const { addToast } = useToasts();

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    throwOnError: false,
    mutationFn: (formData: CarServiceLogFormValues) =>
      submitCarServiceLogAddFormData(carId, formData),
    onMutate: (formData: CarServiceLogFormValues) =>
      serviceLogsByCarIdAddOnMutate(formData, carId, queryClient),
    onSuccess: () => addToast('Service log added successfully.', 'success'),
    onError: (error, _, context) => {
      serviceLogsByCarIdAddOnError(context, carId, queryClient);
      addToast(error.message, 'error');
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

  return {
    handleFormSubmit,
  };
}
