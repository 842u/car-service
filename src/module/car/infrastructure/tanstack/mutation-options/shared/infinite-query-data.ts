import type { InfiniteData } from '@tanstack/react-query';

import type { CarDto } from '@/car/application/dto/car';

export type CarsInfiniteQueryData = InfiniteData<{
  data: (CarDto | null)[];
  nextPageParam: number | null;
}>;

export function deepCopyCarsInfiniteQueryData(
  data: CarsInfiniteQueryData | undefined,
): CarsInfiniteQueryData {
  if (!data) {
    return {
      pages: [{ data: [null], nextPageParam: 0 }],
      pageParams: [0],
    };
  }

  return {
    pages: data.pages.map((page) => ({
      data: page.data.map((car) => car && { ...car }),
      nextPageParam: page.nextPageParam,
    })),
    pageParams: [...data.pageParams],
  };
}

export function addCarToInfiniteQueryData(
  newCar: CarDto,
  queryData: CarsInfiniteQueryData,
  pageLimit: number,
  pageIndex: number = 0,
  carPagePositionIndex: number = 0,
): void {
  const currentPage = queryData.pages[pageIndex];
  const nextPage = queryData.pages[pageIndex + 1];

  if (!currentPage.data[carPagePositionIndex]) {
    currentPage.data.splice(carPagePositionIndex, 1, newCar);
  } else {
    currentPage.data.splice(carPagePositionIndex, 0, newCar);
  }

  if (currentPage.data.length > pageLimit) {
    const carriedCar = currentPage.data.pop();

    if (!nextPage && carriedCar) {
      queryData.pages.push({
        data: [{ ...carriedCar }],
        nextPageParam: pageIndex + 2,
      });
      queryData.pageParams.push(pageIndex + 1);
      currentPage.nextPageParam = pageIndex + 1;
    } else if (nextPage && carriedCar) {
      addCarToInfiniteQueryData(
        { ...carriedCar },
        queryData,
        pageLimit,
        pageIndex + 1,
      );
    }
  }
}

export type DeletedCarContext = {
  deletedCar: CarDto | null;
  deletedCarPageIndex: number | null;
  deletedCarPagePositionIndex: number | null;
};

export function deleteCarFromInfiniteQueryData(
  carId: string,
  queryData: CarsInfiniteQueryData,
): DeletedCarContext {
  let pageIndex = 0;

  const deletedCarContext: DeletedCarContext = {
    deletedCar: null,
    deletedCarPageIndex: null,
    deletedCarPagePositionIndex: null,
  };

  while (pageIndex < queryData.pages.length) {
    const currentPageData = queryData.pages[pageIndex]?.data;
    const nextPage = queryData.pages[pageIndex + 1];

    const carIndexToDelete = currentPageData.findIndex(
      (car) => car?.id === carId,
    );

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

export function patchCarInInfiniteQueryData(
  carId: string,
  patch: Partial<CarDto>,
  queryData: CarsInfiniteQueryData,
): void {
  for (const page of queryData.pages) {
    const index = page.data.findIndex((car) => car?.id === carId);

    if (index !== -1) {
      const existing = page.data[index];
      page.data[index] = existing && { ...existing, ...patch };
      return;
    }
  }
}
