import { Car, CarsInfiniteQueryData } from '@/types';

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
