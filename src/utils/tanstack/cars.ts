import type { QueryClient } from '@tanstack/react-query';

import type { CarFormValues } from '@/schemas/zod/carFormSchema';
import type { Car, CarsInfiniteQueryData, ToastType } from '@/types';
import {
  CAR_IMAGE_UPLOAD_ERROR_CAUSE,
  parseDateToYyyyMmDd,
} from '@/utils/general';

import { queryKeys } from './keys';

export const CARS_INFINITE_QUERY_PAGE_DATA_LIMIT = 15;

function addCarToInfiniteQueryData(
  newCar: Car,
  queryData: CarsInfiniteQueryData,
  pageIndex: number = 0,
  carPagePositionIndex: number = 0,
) {
  const currentPage = queryData.pages[pageIndex];
  const nextPage = queryData.pages[pageIndex + 1];

  if (!currentPage.data[carPagePositionIndex]) {
    currentPage.data.splice(carPagePositionIndex, 1, newCar);
  } else {
    currentPage.data.splice(carPagePositionIndex, 0, newCar);
  }

  if (currentPage.data.length > CARS_INFINITE_QUERY_PAGE_DATA_LIMIT) {
    const carriedCar = currentPage.data.pop();

    if (!nextPage && carriedCar) {
      queryData.pages.push({
        data: [{ ...carriedCar }],
        nextPageParam: pageIndex + 2,
      });
      queryData.pageParams.push(pageIndex + 1);
      currentPage.nextPageParam = pageIndex + 1;
    } else if (nextPage && carriedCar) {
      return addCarToInfiniteQueryData(
        { ...carriedCar },
        queryData,
        pageIndex + 1,
      );
    }
  }

  return;
}

function deepCopyCarsInfiniteQueryData(data: CarsInfiniteQueryData) {
  if (!data)
    return {
      pages: [{ data: [null], nextPageParam: 0 }],
      pageParams: [0],
    } satisfies CarsInfiniteQueryData;

  const deepCopy: CarsInfiniteQueryData = {
    pages: data.pages.map((page) => ({
      data: page.data.map((car) => car && { ...car }),
      nextPageParam: page.nextPageParam,
    })),
    pageParams: [...data.pageParams],
  };

  return deepCopy;
}

export async function carsInfiniteAddOnMutate(
  carFormData: CarFormValues,
  queryClient: QueryClient,
  optimisticCarImageUrl: string | null,
) {
  await queryClient.cancelQueries({ queryKey: queryKeys.infiniteCars });

  const newCar: Car = {
    ...carFormData,
    id: crypto.randomUUID(),
    image_url: optimisticCarImageUrl,
    created_at: parseDateToYyyyMmDd(new Date()),
    created_by: 'optimistic update',
  };

  queryClient.setQueryData(
    queryKeys.infiniteCars,
    (data: CarsInfiniteQueryData) => {
      const updatedQueryData = deepCopyCarsInfiniteQueryData(data);

      addCarToInfiniteQueryData(newCar, updatedQueryData);

      return updatedQueryData;
    },
  );

  return { newCarId: newCar.id };
}

export function carsInfiniteAddOnError(
  error: Error,
  context: Awaited<ReturnType<typeof carsInfiniteAddOnMutate>> | undefined,
  queryClient: QueryClient,
  addToast: (message: string, type: ToastType) => void,
) {
  if (error.cause === CAR_IMAGE_UPLOAD_ERROR_CAUSE) {
    addToast(error.message, 'warning');
  } else {
    addToast(error.message, 'error');
    const previousCarsQuery: CarsInfiniteQueryData | undefined =
      queryClient.getQueryData(queryKeys.infiniteCars);

    if (previousCarsQuery) {
      const updatedQueryData = deepCopyCarsInfiniteQueryData(previousCarsQuery);

      updatedQueryData.pages.forEach((page) => {
        page.data = page.data.filter(
          (car) => car && car.id !== context?.newCarId,
        );
      });

      queryClient.setQueryData(queryKeys.infiniteCars, updatedQueryData);
    }
  }
}

type DeletedCarContext = {
  deletedCar: Car | null;
  deletedCarPageIndex: number | null;
  deletedCarPagePositionIndex: number | null;
};

export function deleteCarFromInfiniteQueryData(
  carId: string,
  queryData: CarsInfiniteQueryData,
) {
  let pageIndex = 0;
  let carIndexToDelete = null;

  const deletedCarContext: DeletedCarContext = {
    deletedCar: null,
    deletedCarPageIndex: null,
    deletedCarPagePositionIndex: null,
  };

  while (pageIndex < queryData.pages.length) {
    const currentPageData = queryData.pages[pageIndex]?.data;
    const nextPage = queryData.pages[pageIndex + 1];

    carIndexToDelete = currentPageData.findIndex((car) => car?.id === carId);

    if (carIndexToDelete === -1 && !nextPage) break;

    if (carIndexToDelete === -1 && nextPage) {
      pageIndex++;
    } else {
      deletedCarContext.deletedCar = currentPageData.splice(
        carIndexToDelete,
        1,
        null,
      )[0];
      deletedCarContext.deletedCarPageIndex = pageIndex;
      deletedCarContext.deletedCarPagePositionIndex = carIndexToDelete;
    }
  }

  return deletedCarContext;
}

export async function carsInfiniteDeleteOnMutate(
  carId: string,
  queryClient: QueryClient,
) {
  await queryClient.cancelQueries({ queryKey: queryKeys.infiniteCars });

  let deletedCarContext: DeletedCarContext = {
    deletedCar: null,
    deletedCarPageIndex: null,
    deletedCarPagePositionIndex: null,
  };

  queryClient.setQueryData(
    queryKeys.infiniteCars,
    (data: CarsInfiniteQueryData) => {
      const updatedQueryData = deepCopyCarsInfiniteQueryData(data);

      deletedCarContext = deleteCarFromInfiniteQueryData(
        carId,
        updatedQueryData,
      );

      return updatedQueryData;
    },
  );

  return deletedCarContext;
}

export async function carsInfiniteDeleteOnError(
  queryClient: QueryClient,
  context: Awaited<ReturnType<typeof carsInfiniteDeleteOnMutate>> | undefined,
) {
  if (
    context?.deletedCar === null ||
    context?.deletedCarPageIndex == null ||
    context?.deletedCarPagePositionIndex == null
  )
    return;

  const previousCarsQueryData = queryClient.getQueryData(
    queryKeys.infiniteCars,
  ) as CarsInfiniteQueryData;

  const updatedQueryData = deepCopyCarsInfiniteQueryData(previousCarsQueryData);

  addCarToInfiniteQueryData(
    context.deletedCar,
    updatedQueryData,
    context.deletedCarPageIndex,
    context.deletedCarPagePositionIndex,
  );

  queryClient.setQueryData(queryKeys.infiniteCars, updatedQueryData);
}

export async function carsUpdateOnMutate(
  queryClient: QueryClient,
  carId: string,
  carFormData: CarFormValues,
  optimisticCarImageUrl: string | null,
) {
  await queryClient.cancelQueries({ queryKey: queryKeys.carsByCarId(carId) });
  const previousCarsQueryData = queryClient.getQueryData([
    'cars',
    carId,
  ]) as Car;

  const editedCar: Car = {
    ...previousCarsQueryData,
    ...carFormData,
    image_url: optimisticCarImageUrl || previousCarsQueryData.image_url,
  };

  queryClient.setQueryData(queryKeys.carsByCarId(carId), () => ({
    ...previousCarsQueryData,
    ...editedCar,
  }));

  return { previousCarsQueryData, carId };
}
