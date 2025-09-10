import type { QueryClient } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Route } from 'next';
import { useEffect, useState } from 'react';

import type { ServiceLogPostRouteHandlerRequest } from '@/app/api/service-log/route';
import { useToasts } from '@/common/presentation/hooks/use-toasts';
import { dependencyContainer, dependencyTokens } from '@/dependency-container';
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

  const httpClient = await dependencyContainer.resolve(
    dependencyTokens.HTTP_CLIENT,
  );

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
      const authClient = await dependencyContainer.resolve(
        dependencyTokens.AUTH_BROWSER_CLIENT,
      );

      const sessionResult = await authClient.getSession();

      if (!sessionResult.success) {
        setUserId(undefined);
        return;
      }

      const {
        user: { id },
      } = sessionResult.data;

      setUserId(id);
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
