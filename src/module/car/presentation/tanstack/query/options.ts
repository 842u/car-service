import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import { carDataSource } from '@/car/dependency/data-source';
import {
  type CarOrderColumn,
  queryKeys,
} from '@/car/presentation/tanstack/query/keys';

export const getCarByIdQueryOptions = (id: string) =>
  queryOptions({
    throwOnError: false,
    queryKey: queryKeys.byId(id),
    queryFn: async () => {
      const carResult = await carDataSource.getById(id);

      if (!carResult.success) {
        const { message } = carResult.error;
        throw new Error(message);
      }

      return carResult.data;
    },
  });

export const getCarsInfiniteQueryOptions = (params?: {
  pageLimit?: number;
  orderBy?: { column: CarOrderColumn; ascending: boolean };
}) =>
  infiniteQueryOptions({
    throwOnError: false,
    queryKey: queryKeys.infinite(params),
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
