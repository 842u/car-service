import { browserDatabaseClient } from '@/dependencies/database-client/browser';
import { CARS_INFINITE_QUERY_PAGE_DATA_LIMIT } from '@/utils/tanstack/cars';

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

export async function getCarsByPage({ pageParam }: { pageParam: number }) {
  const rangeIndexFrom = pageParam * CARS_INFINITE_QUERY_PAGE_DATA_LIMIT;
  const rangeIndexTo =
    (pageParam + 1) * CARS_INFINITE_QUERY_PAGE_DATA_LIMIT - 1;

  const queryResult = await browserDatabaseClient.query(async (from) =>
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
