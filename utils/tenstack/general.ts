import { QueryClient } from '@tanstack/react-query';
import { RefObject } from 'react';

import { AddCarFormValues } from '@/components/ui/AddCarForm/AddCarForm';
import { Car, CarsInfiniteQueryData, ToastType } from '@/types';

import { mapAddCarFormValuesToCarObject } from '../general';
import { CAR_IMAGE_UPLOAD_ERROR_CAUSE } from '../supabase/general';

export const CARS_INFINITE_QUERY_PAGE_DATA_LIMIT = 15;

export function addCarToInfiniteQueryData(
  newCar: Car,
  queryData: CarsInfiniteQueryData,
  pageIndex: number = 0,
) {
  const currentPage = queryData.pages[pageIndex];
  const nextPage = queryData?.pages[pageIndex + 1];

  currentPage.data = [{ ...newCar }, ...currentPage.data];

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

export async function onMutateCarsInfiniteQueryMutation(
  addCarFormData: AddCarFormValues,
  queryClient: QueryClient,
  optimisticCarImageUrlRef: RefObject<string | undefined>,
) {
  await queryClient.cancelQueries({ queryKey: ['cars'] });
  const previousCarsQuery = queryClient.getQueryData(['cars']);

  const newCar = mapAddCarFormValuesToCarObject(addCarFormData);
  optimisticCarImageUrlRef.current = newCar.image_url || '';

  queryClient.setQueryData(['cars'], (data: CarsInfiniteQueryData) => {
    const updatedQueryData: CarsInfiniteQueryData = {
      pages: data.pages.map((page) => ({
        data: page.data.map((car) => ({ ...car })),
        nextPageParam: page.nextPageParam,
      })),
      pageParams: [...data.pageParams],
    };

    addCarToInfiniteQueryData(newCar, updatedQueryData, 0);

    return updatedQueryData;
  });

  return { previousCars: previousCarsQuery, newCarId: newCar.id };
}

export function onErrorCarsInfiniteQueryMutation(
  error: Error,
  context:
    | {
        previousCars: unknown;
        newCarId: string;
      }
    | undefined,
  queryClient: QueryClient,
  addToast: (message: string, type: ToastType) => void,
) {
  if (error.cause === CAR_IMAGE_UPLOAD_ERROR_CAUSE) {
    addToast(error.message, 'warning');
  } else {
    addToast(error.message, 'error');
    const previousCarsQuery: CarsInfiniteQueryData | undefined =
      queryClient.getQueryData(['cars']);

    if (previousCarsQuery) {
      const updatedQueryData: CarsInfiniteQueryData = {
        pages: previousCarsQuery.pages.map((page) => ({
          data: page.data.map((car) => ({ ...car })),
          nextPageParam: page.nextPageParam,
        })),
        pageParams: [...previousCarsQuery.pageParams],
      };

      updatedQueryData.pages.forEach((page) => {
        page.data = page.data.filter((car) => {
          return car.id !== context?.newCarId;
        });
      });

      queryClient.setQueryData(['cars'], updatedQueryData);
    }
  }
}
