import { browserDatabaseClient } from '@/dependency/database-client/browser';

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
