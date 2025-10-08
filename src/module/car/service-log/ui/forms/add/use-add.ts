import type { QueryClient } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Route } from 'next';
import { useEffect, useState } from 'react';

import type { ServiceLogPostRouteHandlerRequest } from '@/app/api/service-log/route';
import { useToasts } from '@/common/presentation/hook/use-toasts';
import { browserAuthClient } from '@/dependencies/auth-client/browser';
import { httpClient } from '@/dependencies/http-client';
import type { CarServiceLogFormValues } from '@/schemas/zod/carServiceLogFormSchema';
import { queryKeys } from '@/utils/tanstack/keys';
import {
  serviceLogsByCarIdAddOnError,
  serviceLogsByCarIdAddOnMutate,
} from '@/utils/tanstack/service_logs';

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
}

export function useAddForm({
  carId,
  onSubmit,
}: Pick<AddFormProps, 'carId' | 'onSubmit'>) {
  const [userId, setUserId] = useState<string | undefined>(undefined);

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

  useEffect(() => {
    const getUserId = async () => {
      const sessionResult = await browserAuthClient.getSession();

      if (!sessionResult.success) {
        setUserId(undefined);
        return;
      }

      const authIdentity = sessionResult.data;

      setUserId(authIdentity.id);
    };

    getUserId();
  }, []);

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
