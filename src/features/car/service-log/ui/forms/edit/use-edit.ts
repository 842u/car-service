import type { QueryClient } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Route } from 'next';

import type {
  ServiceLogPatchRouteHandlerRequest,
  ServiceLogRouteHandlerResponse,
} from '@/app/api/service-log/route';
import { useToasts } from '@/features/common/hooks/use-toasts';
import type { CarServiceLogFormValues } from '@/schemas/zod/carServiceLogFormSchema';
import type { RouteHandlerResponse, ServiceLog } from '@/types';
import { queryKeys } from '@/utils/tanstack/keys';
import {
  serviceLogsByCarIdEditOnError,
  serviceLogsByCarIdEditOnMutate,
} from '@/utils/tanstack/service_logs';

export type UseEditFormOptions = {
  serviceLog: ServiceLog;
  onSubmit?: () => void;
};

type MutationVariables = {
  formData: CarServiceLogFormValues;
  carId: string;
  serviceLogId: string;
  queryClient: QueryClient;
};

async function submitEditFormData(
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

export function useEditForm({ serviceLog, onSubmit }: UseEditFormOptions) {
  const { addToast } = useToasts();

  const queryClient = useQueryClient();

  const serviceLogId = serviceLog.id;

  const carId = serviceLog.car_id;

  const { mutate } = useMutation({
    throwOnError: false,
    mutationFn: ({ formData, serviceLogId }: MutationVariables) =>
      submitEditFormData(serviceLogId, formData),
    onMutate: ({ formData, carId, serviceLogId, queryClient }) =>
      serviceLogsByCarIdEditOnMutate(
        formData,
        carId,
        serviceLogId,
        queryClient,
      ),
  });

  const handleFormSubmit = async (formData: CarServiceLogFormValues) => {
    onSubmit && onSubmit();

    mutate(
      { formData, carId, queryClient, serviceLogId },
      {
        onSuccess: () => addToast('Service log edited.', 'success'),
        onError: (error, { carId, serviceLogId, queryClient }, context) => {
          serviceLogsByCarIdEditOnError(
            context,
            carId,
            serviceLogId,
            queryClient,
          );
          addToast(error.message, 'error');
        },
        onSettled: (_, __, { queryClient }) =>
          queryClient.invalidateQueries({
            queryKey: queryKeys.serviceLogsByCarId(carId),
          }),
      },
    );
  };

  return { handleFormSubmit };
}
