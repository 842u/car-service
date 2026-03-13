import { browserDatabaseClient } from '@/dependency/database-client/browser';
import { CARS_INFINITE_QUERY_PAGE_DATA_LIMIT } from '@/lib/tanstack/cars';
import type { Car } from '@/types';

export async function getCar(carId: string) {
  const queryResult = await browserDatabaseClient.query(async (from) =>
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
  const queryResult = await browserDatabaseClient.query(async (from) =>
    from('cars').delete().eq('id', carId).single(),
  );

  if (!queryResult.success) {
    const { message } = queryResult.error;
    throw new Error(message);
  }

  const car = queryResult.data;

  return car;
}

export async function getCarsByPage({
  pageParam,
  pageLimit = CARS_INFINITE_QUERY_PAGE_DATA_LIMIT,
  orderBy = { column: 'created_at', ascending: false },
}: {
  pageParam: number;
  pageLimit?: number;
  orderBy?: { column: keyof Car; ascending: boolean };
}) {
  const rangeIndexFrom = pageParam * pageLimit;
  const rangeIndexTo = (pageParam + 1) * pageLimit - 1;

  const queryResult = await browserDatabaseClient.query(async (from) =>
    from('cars')
      .select()
      .not(orderBy.column, 'is', null)
      .order(orderBy.column, { ascending: orderBy.ascending })
      .limit(pageLimit)
      .range(rangeIndexFrom, rangeIndexTo),
  );

  if (!queryResult.success) {
    const { message } = queryResult.error;
    throw new Error(message);
  }

  const { data } = queryResult;

  const hasMoreCars = !(data.length < pageLimit);

  return { data, nextPageParam: hasMoreCars ? pageParam + 1 : null };
}
