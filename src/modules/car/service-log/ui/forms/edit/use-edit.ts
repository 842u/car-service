import type { QueryClient } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Route } from 'next';

import type { ServiceLogPatchRouteHandlerRequest } from '@/app/api/service-log/route';
import { useToasts } from '@/common/presentation/hooks/use-toasts';
import { dependencyContainer, dependencyTokens } from '@/di';
import type { CarServiceLogFormValues } from '@/schemas/zod/carServiceLogFormSchema';
import type { ServiceLog } from '@/types';
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

  const httpClient = await dependencyContainer.resolve(
    dependencyTokens.HTTP_CLIENT,
  );

  const headers = { 'Content-Type': 'application/json' };

  const patchResult = await httpClient.patch(url.toString(), jsonRequestData, {
    headers,
  });

  if (!patchResult.success) {
    const { message } = patchResult.error;
    throw new Error(message);
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
