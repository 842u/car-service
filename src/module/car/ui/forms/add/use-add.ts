import type { QueryClient } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Route } from 'next';
import type { RefObject } from 'react';
import { useRef } from 'react';

import type { ApiCarResponse } from '@/app/api/car/route';
import type { CarFormValues } from '@/car/schemas/zod/carFormSchema';
import type { CarFormRef } from '@/car/ui/form/form';
import type { ApiResponseSuccessResult } from '@/common/interface/api/response';
import { useToasts } from '@/common/presentation/hook/use-toasts';
import { httpClient } from '@/dependency/http-client';
import { browserStorageClient } from '@/dependency/storage-client/browser';
import {
  carsInfiniteAddOnError,
  carsInfiniteAddOnMutate,
} from '@/lib/tanstack/cars';
import { queryKeys } from '@/lib/tanstack/keys';
import { CAR_IMAGE_UPLOAD_ERROR_CAUSE, hashFile } from '@/lib/utils';

type MutationVariables = {
  formData: CarFormValues;
  queryClient: QueryClient;
  carFormRef: RefObject<CarFormRef | null>;
};

async function submitAddForm(formData: CarFormValues) {
  const { image, ...data } = formData;

  const jsonDataToValidate = JSON.stringify({
    carFormData: data,
  });

  const url = new URL(window.location.origin);
  url.pathname = '/api/car' satisfies Route;

  const headers = { 'Content-Type': 'application/json' };

  const postResult = await httpClient.post(url.toString(), jsonDataToValidate, {
    headers,
  });

  if (!postResult.success) {
    const { message } = postResult.error;
    throw new Error(message);
  }

  if (!image) return;

  const {
    data: { id },
  } = postResult.data as ApiResponseSuccessResult<ApiCarResponse>;

  const hashedFile = await hashFile(image);

  const uploadPath = `${id}/${hashedFile}`;

  const uploadResult = await browserStorageClient.upload(
    'cars_images',
    uploadPath,
    image,
  );

  if (!uploadResult.success) {
    throw new Error(
      'Car added successfully, but image upload failed. Try again by editing car details.',
      {
        cause: CAR_IMAGE_UPLOAD_ERROR_CAUSE,
      },
    );
  }
}

export function useAddForm({
  onSubmit,
}: {
  onSubmit: (() => void) | undefined;
}) {
  const carFormRef = useRef<CarFormRef>(null);

  const { addToast } = useToasts();

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    throwOnError: false,
    mutationFn: ({ formData }: MutationVariables) => submitAddForm(formData),
    onMutate: ({ formData, queryClient, carFormRef }) =>
      carsInfiniteAddOnMutate(
        formData,
        queryClient,
        carFormRef.current?.imageInputUrl || null,
      ),
    onSuccess: (_, { formData: { custom_name } }) =>
      addToast(`Car ${custom_name} added.`, 'success'),
    onError: (error, { queryClient }, context) =>
      carsInfiniteAddOnError(error, context, queryClient, addToast),
  });

  const handleFormSubmit = (formData: CarFormValues) => {
    onSubmit && onSubmit();
    mutate(
      { formData, queryClient, carFormRef },
      {
        onSettled: (_, __, { queryClient }) =>
          queryClient.invalidateQueries({ queryKey: queryKeys.carsInfinite }),
      },
    );
  };

  return { handleFormSubmit, carFormRef };
}
