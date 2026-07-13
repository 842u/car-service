import type { QueryClient } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Route } from 'next';

import type {
  ServiceLogPostRouteHandlerRequest,
  ServiceLogRouteHandlerResponse,
} from '@/app/api/service-log/route';
import type { CarServiceLogFormValues } from '@/car/schemas/zod/carServiceLogFormSchema';
import { queryKeys } from '@/car/service-log/infrastructure/tanstack/query/keys';
import type { ApiResponseBody } from '@/common/interface/api/response';
import { useToasts } from '@/common/presentation/hook/use-toasts';
import { httpClient } from '@/dependency/http-client';
import {
  serviceLogsByCarIdAddOnError,
  serviceLogsByCarIdAddOnMutate,
} from '@/lib/tanstack/service_logs';
import { useSessionUser } from '@/user/presentation/hooks/use-session-user';

import type { AddFormProps } from './add';

type MutationVariables = {
  formData: CarServiceLogFormValues;
  carId: string;
  userId?: string;
  queryClient: QueryClient;
};

async function submitAddFormData(
  carId: string,
  formData: CarServiceLogFormValues,
) {
  const jsonRequestData = JSON.stringify({
    formData,
    car_id: carId,
  } satisfies ServiceLogPostRouteHandlerRequest);

  const url = new URL(window.location.origin);
  url.pathname = '/api/service-log' satisfies Route;

  const headers = { 'Content-Type': 'application/json' };

  const postResult = await httpClient.post(url.toString(), jsonRequestData, {
    headers,
  });

  if (!postResult.success) {
    const { message } = postResult.error;
    throw new Error(message);
  }

  const body =
    postResult.data as ApiResponseBody<ServiceLogRouteHandlerResponse>;

  if (!body.success) {
    throw new Error(`Request failed: ${body.error.message}`);
  }
}

export function useAddForm({
  carId,
  onSubmit,
}: Pick<AddFormProps, 'carId' | 'onSubmit'>) {
  const { data: sessionUser } = useSessionUser();
  const userId = sessionUser?.id;

  const { addToast } = useToasts();

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    throwOnError: false,
    mutationFn: ({ formData, carId }: MutationVariables) =>
      submitAddFormData(carId, formData),
    onMutate: ({ formData, carId, userId, queryClient }) =>
      serviceLogsByCarIdAddOnMutate(formData, carId, userId, queryClient),
    onSuccess: () => addToast('Service log added.', 'success'),
    onError: (error, { carId, queryClient }, context) => {
      serviceLogsByCarIdAddOnError(context, carId, queryClient);
      addToast(error.message, 'error');
    },
  });

  const handleFormSubmit = async (formData: CarServiceLogFormValues) => {
    mutate(
      { formData, carId, queryClient, userId },
      {
        onSettled: (_, __, { queryClient, carId }) =>
          queryClient.invalidateQueries({
            queryKey: queryKeys.serviceLogsByCarId(carId),
          }),
      },
    );

    onSubmit && onSubmit();
  };

  return {
    handleFormSubmit,
  };
}
