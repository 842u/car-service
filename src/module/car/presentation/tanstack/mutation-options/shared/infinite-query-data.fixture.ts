import type { CarDto } from '@/car/application/dto/car';
import type { CarsInfiniteQueryData } from '@/car/presentation/tanstack/mutation-options/shared/infinite-query-data';

export function buildCarsInfiniteQueryData(
  pages: CarDto[][],
): CarsInfiniteQueryData {
  return {
    pages: pages.map((data, index) => ({
      data,
      nextPageParam: index === pages.length - 1 ? null : index + 1,
    })),
    pageParams: pages.map((_, index) => index),
  };
}
