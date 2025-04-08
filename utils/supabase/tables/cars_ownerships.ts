import { createClient } from '../client';

export async function getCarOwnerships(carId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('cars_ownerships')
    .select()
    .eq('car_id', carId);

  if (error) throw new Error(error.message);

  return data;
}

export async function addCarOwnershipByUserId(
  carId: string,
  userId: string | null,
) {
  if (!userId) throw new Error('You must provide a new owner ID.');

  const supabase = createClient();

  const { data, error } = await supabase
    .from('cars_ownerships')
    .insert({ car_id: carId, owner_id: userId, is_primary_owner: false })
    .select()
    .single();

  if (error) throw new Error(error.message || "Can't add new car owner.");

  return data;
}

export async function deleteCarOwnershipsByUsersIds(
  carId: string,
  usersIds: string[],
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('cars_ownerships')
    .delete()
    .eq('car_id', carId)
    .in('owner_id', usersIds)
    .select();

  if (error) throw new Error(error.message || "Can't delete car owner.");

  if (!data.length)
    throw new Error(
      'Something went wrong when deleting car ownership. Try Again.',
    );

  return data;
}

export async function updateCarPrimaryOwnershipByUserId(
  carId: string,
  newPrimaryOwnerId: string | null,
) {
  if (!newPrimaryOwnerId)
    throw new Error('You must provide a new primary owner ID.');

  const supabase = createClient();

  const { data, error } = await supabase.rpc('switch_primary_car_owner', {
    new_primary_owner_id: newPrimaryOwnerId,
    target_car_id: carId,
  });

  if (error) throw new Error(error.message);

  return data;
}
