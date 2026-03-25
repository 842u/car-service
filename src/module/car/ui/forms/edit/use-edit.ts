import type { QueryClient } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Route } from 'next';

import type { ApiCarResponse } from '@/app/api/car/route';
import type { CarFormValues } from '@/car/schemas/zod/carFormSchema';
import type { ApiResponseSuccessResult } from '@/common/interface/api/response';
import { useToasts } from '@/common/presentation/hook/use-toasts';
import { httpClient } from '@/dependency/http-client';
import { browserStorageClient } from '@/dependency/storage-client/browser';
import { carsUpdateOnMutate } from '@/lib/tanstack/cars';
import { queryKeys } from '@/lib/tanstack/keys';
import { CAR_IMAGE_UPLOAD_ERROR_CAUSE, hashFile } from '@/lib/utils';

interface UseEditFormParams {
  carId: string;
  onSubmit?: () => void;
}

type MutationVariables = {
  formData: CarFormValues;
  carId: string;
  queryClient: QueryClient;
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

  const uploadResult = await browserStorageClient.upload(
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

export function useEditForm({ carId, onSubmit }: UseEditFormParams) {
  const { addToast } = useToasts();

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    throwOnError: false,
    mutationFn: ({ formData, carId }: MutationVariables) =>
      submitEditForm(carId, formData),
    onMutate: ({ formData, carId, queryClient }) =>
      carsUpdateOnMutate(queryClient, carId, formData),
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
      { formData, queryClient, carId },
      {
        onSettled: (_, __, { carId, queryClient }) =>
          queryClient.invalidateQueries({
            queryKey: queryKeys.carsByCarId(carId),
          }),
      },
    );
  };

  return { handleFormSubmit };
}
