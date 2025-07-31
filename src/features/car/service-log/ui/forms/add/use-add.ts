import {
  QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { Route } from 'next';
import { useEffect, useState } from 'react';

import {
  ServiceLogPostRouteHandlerRequest,
  ServiceLogRouteHandlerResponse,
} from '@/app/api/service-log/route';
import { useToasts } from '@/common/hooks/use-toasts';
import { CarServiceLogFormValues } from '@/schemas/zod/carServiceLogFormSchema';
import { RouteHandlerResponse } from '@/types';
import { createClient } from '@/utils/supabase/client';
import { queryKeys } from '@/utils/tanstack/keys';
import {
  serviceLogsByCarIdAddOnError,
  serviceLogsByCarIdAddOnMutate,
} from '@/utils/tanstack/service_logs';

import { AddFormProps } from './add';

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
      const supabase = createClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUserId(session?.user.id);
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
