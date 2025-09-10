import type { QueryClient } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Route } from 'next';
import type { RefObject } from 'react';
import { useRef } from 'react';

import type { ApiCarResponse } from '@/app/api/car/route';
import type { CarFormRef } from '@/car/ui/form/form';
import type { ApiResponseSuccessResult } from '@/common/interface/api/response.interface';
import { useToasts } from '@/common/presentation/hooks/use-toasts';
import { dependencyContainer, dependencyTokens } from '@/dependency-container';
import type { CarFormValues } from '@/schemas/zod/carFormSchema';
import { CAR_IMAGE_UPLOAD_ERROR_CAUSE, hashFile } from '@/utils/general';
import {
  carsInfiniteAddOnError,
  carsInfiniteAddOnMutate,
} from '@/utils/tanstack/cars';
import { queryKeys } from '@/utils/tanstack/keys';

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

  const httpClient = await dependencyContainer.resolve(
    dependencyTokens.HTTP_CLIENT,
  );

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

  const storageClient = await dependencyContainer.resolve(
    dependencyTokens.STORAGE_BROWSER_CLIENT,
  );

  const uploadPath = `${id}/${hashedFile}`;

  const uploadResult = await storageClient.upload(
    'cars_images',
    uploadPath,
    image,
  );

  if (!uploadResult.success) {
    throw new Error(
      'Car added successfully, but image upload failed. You can try again by editing car details.',
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
          queryClient.invalidateQueries({ queryKey: queryKeys.infiniteCars }),
      },
    );
  };

  return { handleFormSubmit, carFormRef };
}
