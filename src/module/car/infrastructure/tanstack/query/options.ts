import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import type { CarDto } from '@/car/application/dto/car';
import { carDataSource } from '@/car/dependency/data-source';
import { queryKeys } from '@/car/infrastructure/tanstack/query/keys';

export const getCarByIdQueryOptions = (id: string) =>
  queryOptions({
    throwOnError: false,
    queryKey: queryKeys.carsByCarId(id),
    queryFn: async () => {
      const carResult = await carDataSource.getById(id);

      if (!carResult.success) {
        const { message } = carResult.error;
        throw new Error(message);
      }

      return carResult.data;
    },
  });

type CarOrderColumn = keyof Pick<
  CarDto,
  'createdAt' | 'insuranceExpiration' | 'technicalInspectionExpiration'
>;

export const getCarsInfiniteQueryOptions = (params?: {
  pageLimit?: number;
  orderBy?: { column: CarOrderColumn; ascending: boolean };
}) =>
  infiniteQueryOptions({
    throwOnError: false,
    queryKey: params?.orderBy
      ? ([
          ...queryKeys.carsInfiniteByColumnOrder(params.orderBy.column),
          params.pageLimit,
        ] as const)
      : queryKeys.carsInfinite,
    queryFn: async ({ pageParam }) => {
      const carsResult = await carDataSource.getByPage({
        pageParam,
        pageLimit: params?.pageLimit,
        orderBy: params?.orderBy,
      });

      if (!carsResult.success) {
        const { message } = carsResult.error;
        throw new Error(message);
      }

      return carsResult.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPageParam,
  });
