import type { QueryClient } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Route } from 'next';

import type { CarDto } from '@/car/application/dto/car';
import { queryKeys } from '@/car/infrastructure/tanstack/query/keys';
import type { CarFormData } from '@/car/interface/ui/car-form.schema';
import type { ApiResponseBody } from '@/common/interface/api/response';
import { useToasts } from '@/common/presentation/hook/use-toasts';
import { httpClient } from '@/dependency/http-client';
import { browserStorageClient } from '@/dependency/storage-client/browser';
import type { LegacyCarFormValues } from '@/lib/tanstack/cars';
import { carsUpdateOnMutate } from '@/lib/tanstack/cars';
import { CAR_IMAGE_UPLOAD_ERROR_CAUSE, hashFile } from '@/lib/utils';

interface UseEditFormParams {
  carId: string;
  onSubmit?: () => void;
}

type MutationVariables = {
  formData: LegacyCarFormValues;
  carId: string;
  queryClient: QueryClient;
};

// Temporary: the mutation path (this file + lib/tanstack/cars.ts) still
// expects the legacy snake_case row shape. Removed once mutation wiring
// takes CarFormData directly.
function toLegacyCarFormValues(formData: CarFormData): LegacyCarFormValues {
  return {
    image: formData.image,
    custom_name: formData.customName,
    brand: formData.brand,
    model: formData.model,
    license_plates: formData.licensePlates,
    vin: formData.vin,
    fuel_type: formData.fuelType,
    additional_fuel_type: formData.additionalFuelType,
    transmission_type: formData.transmissionType,
    drive_type: formData.driveType,
    production_year: formData.productionYear,
    engine_capacity: formData.engineCapacity,
    mileage: formData.mileage,
    insurance_expiration: formData.insuranceExpiration,
    technical_inspection_expiration: formData.technicalInspectionExpiration,
  };
}

async function submitEditForm(carId: string, formData: LegacyCarFormValues) {
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

  const body = patchResult.data as ApiResponseBody<CarDto>;

  if (!body.success) {
    throw new Error(`Request failed: ${body.error.message}`);
  }

  if (!image) return;

  const {
    data: { id },
  } = body;

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

  const handleFormSubmit = (formData: CarFormData) => {
    onSubmit && onSubmit();

    mutate(
      { formData: toLegacyCarFormValues(formData), queryClient, carId },
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
