import { dependencyContainer, dependencyTokens } from '@/dependency-container';

export async function getCarOwnerships(carId: string) {
  const dbClient = await dependencyContainer.resolve(
    dependencyTokens.DATABASE_BROWSER_CLIENT,
  );

  const queryResult = await dbClient.query(async (from) =>
    from('cars_ownerships')
      .select()
      .eq('car_id', carId)
      .order('created_at', { ascending: false }),
  );

  if (!queryResult.success) {
    const { message } = queryResult.error;
    throw new Error(message);
  }

  const { data } = queryResult;

  return data;
}

export async function addCarOwnershipByUserId(carId: string, userId: string) {
  const dbClient = await dependencyContainer.resolve(
    dependencyTokens.DATABASE_BROWSER_CLIENT,
  );

  const queryResult = await dbClient.query(async (from) =>
    from('cars_ownerships')
      .insert({ car_id: carId, owner_id: userId, is_primary_owner: false })
      .select()
      .single(),
  );

  if (!queryResult.success) {
    const { message } = queryResult.error;
    throw new Error(message);
  }

  const { data } = queryResult;

  return data;
}

export async function deleteCarOwnershipsByUsersIds(
  carId: string,
  usersIds: string[],
) {
  const dbClient = await dependencyContainer.resolve(
    dependencyTokens.DATABASE_BROWSER_CLIENT,
  );

  const queryResult = await dbClient.query(async (from) =>
    from('cars_ownerships')
      .delete()
      .eq('car_id', carId)
      .in('owner_id', usersIds)
      .select()
      .single(),
  );

  if (!queryResult.success) {
    const { message } = queryResult.error;
    throw new Error(message);
  }

  const { data } = queryResult;

  return data;
}

export async function updateCarPrimaryOwnershipByUserId(
  carId: string,
  newPrimaryOwnerId: string,
) {
  const dbClient = await dependencyContainer.resolve(
    dependencyTokens.DATABASE_BROWSER_CLIENT,
  );

  const queryResult = await dbClient.rpc(async (rpc) =>
    rpc('switch_primary_car_owner', {
      new_primary_owner_id: newPrimaryOwnerId,
      target_car_id: carId,
    }),
  );

  if (!queryResult.success) {
    const { message } = queryResult.error;
    throw new Error(message);
  }

  const { data } = queryResult;

  return data;
}
