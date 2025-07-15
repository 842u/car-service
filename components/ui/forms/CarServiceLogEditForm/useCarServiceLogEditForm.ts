import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Route } from 'next';

import {
  ServiceLogPatchRouteHandlerRequest,
  ServiceLogRouteHandlerResponse,
} from '@/app/api/service-log/route';
import { useToasts } from '@/hooks/useToasts';
import { CarServiceLogFormValues } from '@/schemas/zod/carServiceLogFormSchema';
import { RouteHandlerResponse, ServiceLog } from '@/types';
import { queryKeys } from '@/utils/tanstack/keys';
import {
  serviceLogsByCarIdEditOnError,
  serviceLogsByCarIdEditOnMutate,
} from '@/utils/tanstack/service_logs';

export type UseCarServiceLogEditFormOptions = {
  serviceLog: ServiceLog;
  onSubmit?: () => void;
};

async function submitCarServiceLogEditFormData(
  serviceLogId: string,
  formData: CarServiceLogFormValues,
) {
  const jsonRequestData = JSON.stringify({
    formData,
    service_log_id: serviceLogId,
  } satisfies ServiceLogPatchRouteHandlerRequest);

  const url = new URL(window.location.origin);
  url.pathname = '/api/service-log' satisfies Route;

  try {
    const apiResponse = await fetch(url, {
      method: 'PATCH',
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

export function useCarServiceLogEditForm({
  serviceLog,
  onSubmit,
}: UseCarServiceLogEditFormOptions) {
  const { addToast } = useToasts();

  const queryClient = useQueryClient();

  const serviceLogId = serviceLog.id;

  const carId = serviceLog.car_id;

  const { mutate } = useMutation({
    throwOnError: false,
    mutationFn: (formData: CarServiceLogFormValues) =>
      submitCarServiceLogEditFormData(serviceLogId, formData),
    onMutate: (formData: CarServiceLogFormValues) =>
      serviceLogsByCarIdEditOnMutate(
        formData,
        carId,
        serviceLogId,
        queryClient,
      ),
  });

  const handleFormSubmit = async (formData: CarServiceLogFormValues) => {
    onSubmit && onSubmit();

    mutate(formData, {
      onSuccess: () => addToast('Service log edited.', 'success'),
      onError: (error, _, context) => {
        serviceLogsByCarIdEditOnError(
          context,
          carId,
          serviceLogId,
          queryClient,
        );
        addToast(error.message, 'error');
      },
      onSettled: () =>
        queryClient.invalidateQueries({
          queryKey: queryKeys.serviceLogsByCarId(carId),
        }),
    });
  };

  return { handleFormSubmit };
}
