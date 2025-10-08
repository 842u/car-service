import type { QueryClient } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Route } from 'next';
import type { RefObject } from 'react';
import { useRef } from 'react';

import type { ApiCarResponse } from '@/app/api/car/route';
import type { ApiResponseSuccessResult } from '@/common/interface/api/response';
import { useToasts } from '@/common/presentation/hook/use-toasts';
import { httpClient } from '@/dependencies/http-client';
import { storageClientBrowser } from '@/dependencies/storage-client/browser';
import type { CarFormValues } from '@/schemas/zod/carFormSchema';
import { CAR_IMAGE_UPLOAD_ERROR_CAUSE, hashFile } from '@/utils/general';
import { carsUpdateOnMutate } from '@/utils/tanstack/cars';
import { queryKeys } from '@/utils/tanstack/keys';

import type { CarFormRef } from '../../form/form';

export type UseEditFormOptions = {
  carId: string;
  onSubmit?: () => void;
};

type MutationVariables = {
  formData: CarFormValues;
  carId: string;
  queryClient: QueryClient;
  carFormRef: RefObject<CarFormRef | null>;
};

async function submitEditForm(carId: string, formData: CarFormValues) {
  const { image, ...data } = formData;

  const jsonDataToValidate = JSON.stringify({
    carFormData: data,
    carId,
  });

  const url = new URL(window.location.origin);
  url.pathname = '/api/car' satisfies Route;

  const headers = { 'Content-Type': 'application/json' };

  const patchResult = await httpClient.patch(
    url.toString(),
    jsonDataToValidate,
    {
      headers,
    },
  );

  if (!patchResult.success) {
    const { message } = patchResult.error;
    throw new Error(message);
  }

  if (!image) return;

  const {
    data: { id },
  } = patchResult.data as ApiResponseSuccessResult<ApiCarResponse>;

  const hashedFile = await hashFile(image);

  const uploadPath = `${id}/${hashedFile}`;

  const uploadResult = await storageClientBrowser.upload(
    'cars_images',
    uploadPath,
    image,
  );

  if (!uploadResult.success) {
    throw new Error(
      'Car edited successfully, but image upload failed. Try again.',
      {
        cause: CAR_IMAGE_UPLOAD_ERROR_CAUSE,
      },
    );
  }
}

export function useEditForm({ carId, onSubmit }: UseEditFormOptions) {
  const carFormRef = useRef<CarFormRef>(null);

  const { addToast } = useToasts();

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    throwOnError: false,
    mutationFn: ({ formData, carId }: MutationVariables) =>
      submitEditForm(carId, formData),
    onMutate: ({ formData, carId, queryClient, carFormRef }) =>
      carsUpdateOnMutate(
        queryClient,
        carId,
        formData,
        carFormRef.current?.imageInputUrl || null,
      ),
    onSuccess: (_, { formData: { custom_name } }) =>
      addToast(`Car ${custom_name} edited.`, 'success'),
    onError: (error, { carId, queryClient }, context) => {
      addToast(error.message, 'error');

      queryClient.setQueryData(['cars', carId], context?.previousCarsQueryData);
    },
  });

  const handleFormSubmit = (formData: CarFormValues) => {
    onSubmit && onSubmit();

    mutate(
      { formData, queryClient, carId, carFormRef },
      {
        onSettled: (_, __, { carId, queryClient }) =>
          queryClient.invalidateQueries({
            queryKey: queryKeys.carsByCarId(carId),
          }),
      },
    );
  };

  return { handleFormSubmit, carFormRef };
}
