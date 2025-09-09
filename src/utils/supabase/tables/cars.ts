import type { Route } from 'next';

import type { ApiCarRequestBody, ApiCarResponse } from '@/app/api/car/route';
import type { RouteHandlerResponse } from '@/common/types';
import { dependencyContainer, dependencyTokens } from '@/dependency-container';
import type { CarFormValues } from '@/schemas/zod/carFormSchema';
import { CAR_IMAGE_UPLOAD_ERROR_CAUSE, hashFile } from '@/utils/general';
import { CARS_INFINITE_QUERY_PAGE_DATA_LIMIT } from '@/utils/tanstack/cars';

export async function getCar(carId: string) {
  const dbClient = await dependencyContainer.resolve(
    dependencyTokens.DATABASE_BROWSER_CLIENT,
  );

  const queryResult = await dbClient.query(async (from) =>
    from('cars').select().eq('id', carId).single(),
  );

  if (!queryResult.success) {
    const { message } = queryResult.error;
    throw new Error(message);
  }

  const car = queryResult.data;

  return car;
}

export async function deleteCar(carId: string) {
  const dbClient = await dependencyContainer.resolve(
    dependencyTokens.DATABASE_BROWSER_CLIENT,
  );

  const queryResult = await dbClient.query(async (from) =>
    from('cars').delete().eq('id', carId).single(),
  );

  if (!queryResult.success) {
    const { message } = queryResult.error;
    throw new Error(message);
  }

  const car = queryResult.data;

  return car;
}

export async function getCarsByPage({ pageParam }: { pageParam: number }) {
  const rangeIndexFrom = pageParam * CARS_INFINITE_QUERY_PAGE_DATA_LIMIT;
  const rangeIndexTo =
    (pageParam + 1) * CARS_INFINITE_QUERY_PAGE_DATA_LIMIT - 1;

  const dbClient = await dependencyContainer.resolve(
    dependencyTokens.DATABASE_BROWSER_CLIENT,
  );

  const queryResult = await dbClient.query(async (from) =>
    from('cars')
      .select()
      .order('created_at', { ascending: false })
      .limit(CARS_INFINITE_QUERY_PAGE_DATA_LIMIT)
      .range(rangeIndexFrom, rangeIndexTo),
  );

  if (!queryResult.success) {
    const { message } = queryResult.error;
    throw new Error(message);
  }

  const { data } = queryResult;

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

    const storageClient = await dependencyContainer.resolve(
      dependencyTokens.STORAGE_BROWSER_CLIENT,
    );

    const uploadPath = `${responseData.id}/${hashedFile}`;

    const uploadResult = await storageClient.upload(
      'cars_images',
      uploadPath,
      image,
    );

    if (!uploadResult.success) {
      throw new Error(
        'Car added successfully, but image upload failed. You can edit and upload the image in your car details.',
        {
          cause: CAR_IMAGE_UPLOAD_ERROR_CAUSE,
        },
      );
    }
  }

  return responseData;
}
