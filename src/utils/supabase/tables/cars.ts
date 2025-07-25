import { Route } from 'next';

import { ApiCarRequestBody, ApiCarResponse } from '@/app/api/car/route';
import { CarFormValues } from '@/schemas/zod/carFormSchema';
import { RouteHandlerResponse } from '@/types';
import { CAR_IMAGE_UPLOAD_ERROR_CAUSE, hashFile } from '@/utils/general';
import { CARS_INFINITE_QUERY_PAGE_DATA_LIMIT } from '@/utils/tanstack/cars';

import { createClient } from '../client';

export async function getCar(carId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('cars')
    .select()
    .eq('id', carId)
    .limit(1);

  if (error) throw new Error(error.message);

  if (!data[0]) throw new Error("Can't get car.");

  return data[0];
}

export async function deleteCar(carId: string) {
  const supabase = createClient();

  const response = await supabase.from('cars').delete().eq('id', carId);

  return response;
}

export async function getCarsByPage({ pageParam }: { pageParam: number }) {
  const rangeIndexFrom = pageParam * CARS_INFINITE_QUERY_PAGE_DATA_LIMIT;
  const rangeIndexTo =
    (pageParam + 1) * CARS_INFINITE_QUERY_PAGE_DATA_LIMIT - 1;

  const supabase = createClient();
  const { data, error } = await supabase
    .from('cars')
    .select()
    .order('created_at', { ascending: false })
    .limit(CARS_INFINITE_QUERY_PAGE_DATA_LIMIT)
    .range(rangeIndexFrom, rangeIndexTo);

  if (error) throw new Error(error.message);

  const hasMoreCars = !(data.length < CARS_INFINITE_QUERY_PAGE_DATA_LIMIT);

  return { data, nextPageParam: hasMoreCars ? pageParam + 1 : null };
}

export async function handleCarFormSubmit(
  formData: CarFormValues,
  carId: string | null,
  method: 'POST' | 'PATCH',
) {
  const { image, ...data } = formData;

  const jsonDataToValidate = JSON.stringify({
    carFormData: data,
    carId,
  } satisfies ApiCarRequestBody);

  const url = new URL(window.location.origin);
  url.pathname = '/api/car' satisfies Route;

  let newCarResponse: Response | null = null;

  try {
    newCarResponse = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonDataToValidate,
    });
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
  }

  const { data: responseData, error } =
    (await newCarResponse?.json()) as RouteHandlerResponse<ApiCarResponse>;

  if (error) throw new Error(error.message);

  if (image && responseData?.id) {
    const hashedFile = await hashFile(image);

    const supabase = createClient();

    const { error: imageUploadError } = await supabase.storage
      .from('cars_images')
      .upload(`${responseData.id}/${hashedFile}`, image);

    if (imageUploadError)
      throw new Error(
        'Car added successfully, but image upload failed. You can edit and upload the image in your car details.',
        {
          cause: CAR_IMAGE_UPLOAD_ERROR_CAUSE,
        },
      );
  }

  return responseData;
}
